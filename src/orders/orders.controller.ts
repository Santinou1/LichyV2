import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemsDto } from './dto/add-order-items.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { OrderStatus, OrderDestination } from '../database/entities/enums';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Crear nuevo pedido
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    // TODO: Obtener userId del token JWT cuando se implemente autenticación
    @Query('userId', ParseIntPipe) userId: number
  ) {
    return await this.ordersService.createOrder(createOrderDto, userId);
  }

  // Obtener todos los pedidos
  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  // Obtener pedido por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.findOne(id);
  }

  // Obtener pedidos por destino
  @Get('destination/:destination')
  async findByDestination(@Param('destination') destination: OrderDestination) {
    return await this.ordersService.findByDestination(destination);
  }

  // Obtener pedidos por estado
  @Get('status/:status')
  async findByStatus(@Param('status') status: OrderStatus) {
    return await this.ordersService.findByStatus(status);
  }

  // Actualizar pedido
  @Put(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  // Cambiar estado del pedido
  @Patch(':id/status')
  async changeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeOrderStatusDto,
    // TODO: Obtener userId del token JWT cuando se implemente autenticación
    @Query('userId', ParseIntPipe) userId: number
  ) {
    return await this.ordersService.changeOrderStatus(id, changeStatusDto, userId);
  }

  // Agregar items a pedido existente
  @Post(':id/items')
  async addOrderItems(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() addItemsDto: AddOrderItemsDto,
    // TODO: Obtener userId del token JWT cuando se implemente autenticación
    @Query('userId', ParseIntPipe) userId: number
  ) {
    return await this.ordersService.addOrderItems(orderId, addItemsDto, userId);
  }

  // Crear pedido y agregar items (endpoint especial del roadmap)
  @Post('items')
  async createOrderWithItems(
    @Body() addItemsDto: AddOrderItemsDto,
    // TODO: Obtener userId del token JWT cuando se implemente autenticación
    @Query('userId', ParseIntPipe) userId: number
  ) {
    return await this.ordersService.addOrderItems(null, addItemsDto, userId);
  }

  // Obtener historial de cambios de estado
  @Get(':id/status-history')
  async getOrderStatusHistory(@Param('id', ParseIntPipe) orderId: number) {
    return await this.ordersService.getOrderStatusHistory(orderId);
  }

  // Eliminar pedido
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.deleteOrder(id);
  }
} 