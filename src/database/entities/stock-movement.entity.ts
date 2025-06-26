import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ContainerProduct } from './container-product.entity';
import { ColoredProduct } from './colored-product.entity';
import { MovementType, MovementReason, ProductUnit } from './enums';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MovementType
  })
  type: MovementType;

  @Column({
    type: 'enum',
    enum: MovementReason
  })
  reason: MovementReason;

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  quantity: number; // Cantidad movida con alta precisión

  @Column({
    type: 'enum',
    enum: ProductUnit
  })
  unit: ProductUnit;

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  previousStock: number; // Stock anterior con alta precisión

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  newStock: number; // Stock nuevo con alta precisión

  @Column({ type: 'decimal', precision: 20, scale: 6, nullable: true })
  unitCost: number; // Costo unitario con precisión monetaria

  @Column({ type: 'decimal', precision: 25, scale: 6, nullable: true })
  totalCost: number; // Costo total del movimiento

  @Column({ type: 'text' })
  notes: string; // COMENTARIO OBLIGATORIO - Descripción detallada del movimiento

  @Column({ nullable: true })
  referenceNumber: string; // Número de referencia (pedido, factura, etc.)

  @Column({ type: 'date' })
  movementDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.stockMovements)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => ContainerProduct, containerProduct => containerProduct.stockMovements)
  @JoinColumn({ name: 'containerProductId' })
  containerProduct: ContainerProduct;

  @Column({ nullable: true })
  containerProductId: number;

  @ManyToOne(() => ColoredProduct, coloredProduct => coloredProduct.stockMovements)
  @JoinColumn({ name: 'coloredProductId' })
  coloredProduct: ColoredProduct;

  @Column({ nullable: true })
  coloredProductId: number;
} 