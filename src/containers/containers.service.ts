import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Container } from '../database/entities/container.entity';
import { Product } from '../database/entities/product.entity';
import { ContainerProduct } from '../database/entities/container-product.entity';
import { ColoredProduct } from '../database/entities/colored-product.entity';
import { ContainerMovement } from '../database/entities/container-movement.entity';
import { StockMovement } from '../database/entities/stock-movement.entity';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { ChangeContainerStatusDto } from './dto/change-container-status.dto';
import { DistributeProductsDto } from './dto/distribute-products.dto';
import { ContainerMovementType, MovementType, MovementReason, ProductUnit, ProductAlternativeUnit } from '../database/entities/enums';
import { ContainerCategory, ContainerLocation } from '../database/entities/enums';

@Injectable()
export class ContainersService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ContainerProduct)
    private readonly containerProductRepository: Repository<ContainerProduct>,
    @InjectRepository(ColoredProduct)
    private readonly coloredProductRepository: Repository<ColoredProduct>,
    @InjectRepository(ContainerMovement)
    private readonly containerMovementRepository: Repository<ContainerMovement>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.containerRepository.find({
      relations: ['containerProducts', 'containerProducts.coloredProducts'],
    });
  }

  async findOne(id: number) {
    const container = await this.containerRepository.findOne({
      where: { id },
      relations: ['containerProducts', 'containerProducts.coloredProducts'],
    });
    
    if (!container) {
      throw new NotFoundException(`Contenedor con ID ${id} no encontrado`);
    }
    
    return container;
  }

  async findByCode(code: string) {
    const container = await this.containerRepository.findOne({
      where: { code },
      relations: ['containerProducts', 'containerProducts.coloredProducts'],
    });
    
    if (!container) {
      throw new NotFoundException(`Contenedor con código ${code} no encontrado`);
    }
    
    return container;
  }

  async create(createContainerDto: CreateContainerDto) {
    const existingContainer = await this.containerRepository.findOne({
      where: { code: createContainerDto.code },
    });
    
    if (existingContainer) {
      throw new BadRequestException(`Ya existe un contenedor con el código ${createContainerDto.code}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const container = this.containerRepository.create({
        code: createContainerDto.code,
        supplier: createContainerDto.supplier,
        category: createContainerDto.category || ContainerCategory.CREADO,
        location: createContainerDto.location || ContainerLocation.NUEVO,
        fob: createContainerDto.fob,
        supplierItem: createContainerDto.supplierItem,
        notes: createContainerDto.notes,
      });

      const savedContainer = await queryRunner.manager.save(Container, container);

      for (const productDto of createContainerDto.products) {
        if (productDto.isNewProduct && productDto.newProduct) {
          const newProduct = this.productRepository.create({
            name: productDto.newProduct.name,
            description: productDto.newProduct.description,
          });

          const savedProduct = await queryRunner.manager.save(Product, newProduct);

          let defaultAlternativeUnit = productDto.newProduct.alternativeUnit;
          if (!defaultAlternativeUnit) {
            switch (productDto.newProduct.unit) {
              case ProductUnit.M:
              case ProductUnit.KG:
                defaultAlternativeUnit = ProductAlternativeUnit.ROLLOS;
                break;
              case ProductUnit.UNI:
                defaultAlternativeUnit = ProductAlternativeUnit.CAJAS;
                break;
              default:
                defaultAlternativeUnit = ProductAlternativeUnit.ROLLOS;
            }
          }

          const containerProduct = this.containerProductRepository.create({
            containerId: savedContainer.id,
            productId: savedProduct.id,
            name: productDto.newProduct.name,
            description: productDto.newProduct.description,
            unit: productDto.newProduct.unit,
            totalQuantity: productDto.newProduct.totalQuantity,
            availableQuantity: productDto.newProduct.totalQuantity,
            alternativeUnit: defaultAlternativeUnit,
            alternativeQuantity: productDto.newProduct.alternativeQuantity,
          });

          await queryRunner.manager.save(ContainerProduct, containerProduct);
        } else if (!productDto.isNewProduct && productDto.existingProduct) {
          const existingProduct = await this.productRepository.findOne({
            where: { id: productDto.existingProduct.productId },
          });

          if (!existingProduct) {
            throw new NotFoundException(`Producto con ID ${productDto.existingProduct.productId} no encontrado`);
          }

          let defaultAlternativeUnit = productDto.existingProduct.alternativeUnit;
          if (!defaultAlternativeUnit) {
            switch (productDto.existingProduct.unit) {
              case ProductUnit.M:
              case ProductUnit.KG:
                defaultAlternativeUnit = ProductAlternativeUnit.ROLLOS;
                break;
              case ProductUnit.UNI:
                defaultAlternativeUnit = ProductAlternativeUnit.CAJAS;
                break;
              default:
                defaultAlternativeUnit = ProductAlternativeUnit.ROLLOS;
            }
          }

          const containerProduct = this.containerProductRepository.create({
            containerId: savedContainer.id,
            productId: existingProduct.id,
            name: existingProduct.name,
            description: existingProduct.description,
            unit: productDto.existingProduct.unit,
            totalQuantity: productDto.existingProduct.totalQuantity,
            availableQuantity: productDto.existingProduct.totalQuantity,
            alternativeUnit: defaultAlternativeUnit,
            alternativeQuantity: productDto.existingProduct.alternativeQuantity,
          });

          await queryRunner.manager.save(ContainerProduct, containerProduct);
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedContainer.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateContainerDto: UpdateContainerDto) {
    const container = await this.findOne(id);
    Object.assign(container, updateContainerDto);
    return this.containerRepository.save(container);
  }

  async remove(id: number) {
    const container = await this.findOne(id);
    return this.containerRepository.remove(container);
  }

  async changeStatus(id: number, changeStatusDto: ChangeContainerStatusDto, userId: number) {
    const container = await this.findOne(id);
    
    const previousCategory = container.category;
    const previousLocation = container.location;
    
    container.category = changeStatusDto.newCategory;
    container.location = changeStatusDto.newLocation;
    
    await this.containerRepository.save(container);

    const movement = this.containerMovementRepository.create({
      type: ContainerMovementType.CAMBIO_AMBOS,
      previousCategory,
      previousLocation,
      newCategory: changeStatusDto.newCategory,
      newLocation: changeStatusDto.newLocation,
      notes: changeStatusDto.notes,
      movementDate: new Date(),
      createdById: userId,
      containerId: id,
    });

    await this.containerMovementRepository.save(movement);
    return container;
  }

  async distributeProducts(containerId: number, distributeDto: DistributeProductsDto, userId: number) {
    const container = await this.findOne(containerId);
    const containerProduct = await this.containerProductRepository.findOne({
      where: { id: distributeDto.containerProductId, containerId },
    });

    if (!containerProduct) {
      throw new NotFoundException(`Producto del contenedor con ID ${distributeDto.containerProductId} no encontrado en el contenedor ${containerId}`);
    }

    const totalDistributed = distributeDto.colorDistributions.reduce((sum, dist) => sum + dist.quantity, 0);
    
    if (totalDistributed > containerProduct.totalQuantity) {
      throw new BadRequestException(
        `La suma de cantidades distribuidas (${totalDistributed}) excede la cantidad total del producto (${containerProduct.totalQuantity})`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const coloredProducts: ColoredProduct[] = [];
      
      for (const distribution of distributeDto.colorDistributions) {
        const coloredProduct = this.coloredProductRepository.create({
          color: distribution.color,
          unit: distribution.unit,
          quantity: distribution.quantity,
          alternativeUnit: distribution.alternativeUnit,
          alternativeQuantity: distribution.alternativeQuantity,
          availableQuantity: distribution.quantity,
          containerProductId: containerProduct.id,
        });

        const savedColoredProduct = await queryRunner.manager.save(ColoredProduct, coloredProduct);
        coloredProducts.push(savedColoredProduct);

        const stockMovement = this.stockMovementRepository.create({
          type: MovementType.INGRESO,
          reason: MovementReason.DISTRIBUCION_COLORES,
          quantity: distribution.quantity,
          unit: distribution.unit,
          previousStock: 0,
          newStock: distribution.quantity,
          notes: `Distribución por colores: ${distribution.quantity} ${distribution.unit} de color ${distribution.color}. ${distributeDto.notes}`,
          movementDate: new Date(),
          createdById: userId,
          coloredProductId: savedColoredProduct.id,
        });

        await queryRunner.manager.save(StockMovement, stockMovement);
      }

      containerProduct.availableQuantity = containerProduct.totalQuantity - totalDistributed;
      await queryRunner.manager.save(ContainerProduct, containerProduct);

      const parentStockMovement = this.stockMovementRepository.create({
        type: MovementType.EGRESO,
        reason: MovementReason.DISTRIBUCION_COLORES,
        quantity: totalDistributed,
        unit: containerProduct.unit,
        previousStock: containerProduct.totalQuantity,
        newStock: containerProduct.availableQuantity,
        notes: `Producto del contenedor distribuido por colores. Cantidad distribuida: ${totalDistributed} ${containerProduct.unit}. ${distributeDto.notes}`,
        movementDate: new Date(),
        createdById: userId,
        containerProductId: containerProduct.id,
      });

      await queryRunner.manager.save(StockMovement, parentStockMovement);

      await queryRunner.commitTransaction();

      return {
        message: 'Productos distribuidos exitosamente',
        distributedProducts: coloredProducts,
        containerProduct: containerProduct,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMovementHistory(id: number) {
    await this.findOne(id);
    
    return this.containerMovementRepository.find({
      where: { containerId: id },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
