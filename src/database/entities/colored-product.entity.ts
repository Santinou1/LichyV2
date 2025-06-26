import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ContainerProduct } from './container-product.entity';
import { StockMovement } from './stock-movement.entity';
import { ProductUnit, ProductAlternativeUnit, ProductStatus } from './enums';

@Entity('colored_products')
export class ColoredProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column({
    type: 'enum',
    enum: ProductUnit
  })
  unit: ProductUnit;

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  quantity: number; // Cantidad en la unidad principal con alta precisión

  @Column({
    type: 'enum',
    enum: ProductAlternativeUnit,
    nullable: true
  })
  alternativeUnit: ProductAlternativeUnit;

  @Column({ type: 'decimal', precision: 25, scale: 8, nullable: true })
  alternativeQuantity: number; // Cantidad en unidad alternativa con alta precisión

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  quantityPerAlternative: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.EN_STOCK
  })
  status: ProductStatus;

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  availableQuantity: number; // Cantidad disponible con alta precisión

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  reservedQuantity: number; // Cantidad reservada con alta precisión

  @Column({ type: 'decimal', precision: 25, scale: 8, default: 0 })
  soldQuantity: number; // Cantidad vendida con alta precisión

  @Column({ type: 'decimal', precision: 20, scale: 6, nullable: true })
  unitPrice: number; // Precio unitario con precisión monetaria

  @Column({ type: 'decimal', precision: 25, scale: 6, nullable: true })
  totalValue: number; // Valor total del producto coloreado

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ContainerProduct, containerProduct => containerProduct.coloredProducts)
  @JoinColumn({ name: 'containerProductId' })
  containerProduct: ContainerProduct;

  @Column()
  containerProductId: number;

  @OneToMany(() => StockMovement, movement => movement.coloredProduct)
  stockMovements: StockMovement[];
} 