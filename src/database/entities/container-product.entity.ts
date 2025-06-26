import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Container } from './container.entity';
import { Product } from './product.entity';
import { ColoredProduct } from './colored-product.entity';
import { StockMovement } from './stock-movement.entity';
import { ProductUnit, ProductAlternativeUnit, ProductStatus } from './enums';

@Entity('container_products')
export class ContainerProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  containerId: number;

  @Column()
  productId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProductUnit
  })
  unit: ProductUnit;

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  totalQuantity: number;

  @Column({
    type: 'enum',
    enum: ProductAlternativeUnit,
    nullable: true
  })
  alternativeUnit: ProductAlternativeUnit;

  @Column({ type: 'decimal', precision: 25, scale: 8, nullable: true })
  alternativeQuantity: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  quantityPerAlternative: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.EN_STOCK
  })
  status: ProductStatus;

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  availableQuantity: number;

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  reservedQuantity: number;

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  soldQuantity: number;

  @Column({ type: 'decimal', precision: 20, scale: 6, nullable: true })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 25, scale: 6, nullable: true })
  totalValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Container, container => container.containerProducts)
  @JoinColumn({ name: 'containerId' })
  container: Container;

  @ManyToOne(() => Product, product => product.containerProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToMany(() => ColoredProduct, coloredProduct => coloredProduct.containerProduct)
  coloredProducts: ColoredProduct[];

  @OneToMany(() => StockMovement, movement => movement.containerProduct)
  stockMovements: StockMovement[];
} 