import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { ColoredProduct } from '../database/entities/colored-product.entity';
import { OrderStatusChange } from '../database/entities/order-status-change.entity';
import { User } from '../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemsDto, OrderItemDto } from './dto/add-order-items.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { OrderStatus, OrderDestination } from '../database/entities/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ColoredProduct)
    private coloredProductRepository: Repository<ColoredProduct>,
    @InjectRepository(OrderStatusChange)
    private orderStatusChangeRepository: Repository<OrderStatusChange>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // Generar número de pedido único
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const prefix = `ORD-${year}${month}${day}-`;
    
    // Buscar el último pedido del día
    const lastOrder = await this.orderRepository.findOne({
      where: {
        orderNumber: Like(`${prefix}%`),
      },
      order: { orderNumber: 'DESC' },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  // Crear nuevo pedido
  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const orderNumber = await this.generateOrderNumber();

    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
      createdBy: user,
      createdById: userId,
      taxRate: createOrderDto.taxRate || 21.00, // IVA por defecto
    });

    return await this.orderRepository.save(order);
  }

  // Obtener todos los pedidos
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['items', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener pedido por ID
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.coloredProduct', 'items.product', 'createdBy'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  // Obtener pedidos por destino
  async findByDestination(destination: OrderDestination): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { destination },
      relations: ['items', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener pedidos por estado
  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      relations: ['items', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Actualizar pedido
  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    Object.assign(order, updateOrderDto);
    
    // Recalcular totales si se cambió la tasa de impuesto
    if (updateOrderDto.taxRate !== undefined) {
      await this.recalculateOrderTotals(order);
    }

    return await this.orderRepository.save(order);
  }

  // Cambiar estado del pedido
  async changeOrderStatus(id: number, changeStatusDto: ChangeOrderStatusDto, userId: number): Promise<Order> {
    const order = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const previousStatus = order.status;
    const newStatus = changeStatusDto.status;

    // Validaciones de transición de estado
    this.validateStatusTransition(previousStatus, newStatus);

    // Registrar el cambio de estado
    const statusChange = this.orderStatusChangeRepository.create({
      order,
      orderId: order.id,
      previousStatus: previousStatus,
      newStatus: newStatus,
      notes: changeStatusDto.comment,
      changeDate: new Date(),
      changedBy: user,
      changedById: userId,
    });

    await this.orderStatusChangeRepository.save(statusChange);

    // Actualizar el estado del pedido
    order.status = newStatus;
    return await this.orderRepository.save(order);
  }

  // Validar transición de estado
  private validateStatusTransition(fromStatus: OrderStatus, toStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDIENTE]: [OrderStatus.CONFIRMADO, OrderStatus.CANCELADO],
      [OrderStatus.CONFIRMADO]: [OrderStatus.EN_PREPARACION, OrderStatus.CANCELADO],
      [OrderStatus.EN_PREPARACION]: [OrderStatus.ENVIADO, OrderStatus.CANCELADO],
      [OrderStatus.ENVIADO]: [OrderStatus.ENTREGADO],
      [OrderStatus.ENTREGADO]: [],
      [OrderStatus.CANCELADO]: [],
    };

    const allowedTransitions = validTransitions[fromStatus] || [];
    if (!allowedTransitions.includes(toStatus)) {
      throw new BadRequestException(
        `Transición de estado no válida: de ${fromStatus} a ${toStatus}`
      );
    }
  }

  // Agregar items a pedido (crear pedido si no existe)
  async addOrderItems(orderId: number | null, addItemsDto: AddOrderItemsDto, userId: number): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let order: Order;

      // Si no se proporciona orderId, crear un nuevo pedido
      if (!orderId) {
        const createOrderDto: CreateOrderDto = {
          destination: OrderDestination.MITRE, // Destino por defecto
          taxRate: 21.00,
        };
        order = await this.createOrder(createOrderDto, userId);
      } else {
        order = await this.findOne(orderId);
        
        // Verificar que el pedido no esté cancelado o entregado
        if (order.status === OrderStatus.CANCELADO || order.status === OrderStatus.ENTREGADO) {
          throw new BadRequestException('No se pueden agregar items a un pedido cancelado o entregado');
        }
      }

      // Procesar cada item
      for (const itemDto of addItemsDto.items) {
        await this.addOrderItem(order, itemDto, queryRunner);
      }

      // Recalcular totales del pedido
      await this.recalculateOrderTotals(order, queryRunner);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Agregar un item individual al pedido
  private async addOrderItem(order: Order, itemDto: OrderItemDto, queryRunner: any): Promise<void> {
    // Verificar que el producto coloreado existe y tiene stock disponible
    const coloredProduct = await this.coloredProductRepository.findOne({
      where: { id: itemDto.coloredProductId },
      relations: ['containerProduct', 'containerProduct.product'],
    });

    if (!coloredProduct) {
      throw new NotFoundException(`Producto coloreado con ID ${itemDto.coloredProductId} no encontrado`);
    }

    // Verificar disponibilidad
    const availableQuantity = coloredProduct.availableQuantity - coloredProduct.reservedQuantity;
    if (availableQuantity < itemDto.quantity) {
      throw new BadRequestException(
        `Cantidad insuficiente. Disponible: ${availableQuantity}, Solicitado: ${itemDto.quantity}`
      );
    }

    // Crear el item del pedido
    const orderItem = this.orderItemRepository.create({
      orderId: order.id,
      coloredProductId: coloredProduct.id,
      productId: coloredProduct.containerProduct.product.id,
      quantity: itemDto.quantity,
      unit: coloredProduct.unit,
      unitPrice: itemDto.unitPrice,
      totalPrice: itemDto.quantity * itemDto.unitPrice,
      finalPrice: itemDto.quantity * itemDto.unitPrice,
      color: itemDto.color || coloredProduct.color,
      notes: itemDto.notes,
      expectedDeliveryDate: itemDto.expectedDeliveryDate ? new Date(itemDto.expectedDeliveryDate) : undefined,
    });

    await queryRunner.manager.save(OrderItem, orderItem);

    // Reservar la cantidad
    coloredProduct.reservedQuantity += itemDto.quantity;
    await queryRunner.manager.save(ColoredProduct, coloredProduct);
  }

  // Recalcular totales del pedido
  private async recalculateOrderTotals(order: Order, queryRunner?: any): Promise<void> {
    const items = await this.orderItemRepository.find({
      where: { orderId: order.id },
    });

    const subtotal = items.reduce((sum, item) => sum + item.finalPrice, 0);
    const taxAmount = (subtotal * order.taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    order.subtotal = subtotal;
    order.taxAmount = taxAmount;
    order.totalAmount = totalAmount;

    if (queryRunner) {
      await queryRunner.manager.save(Order, order);
    } else {
      await this.orderRepository.save(order);
    }
  }

  // Eliminar pedido
  async deleteOrder(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    // Verificar que el pedido no tenga items
    if (order.items && order.items.length > 0) {
      throw new BadRequestException('No se puede eliminar un pedido que tiene items');
    }

    await this.orderRepository.remove(order);
  }

  // Obtener historial de cambios de estado
  async getOrderStatusHistory(orderId: number): Promise<OrderStatusChange[]> {
    return await this.orderStatusChangeRepository.find({
      where: { orderId },
      relations: ['changedBy'],
      order: { createdAt: 'DESC' },
    });
  }
} 