import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { ColoredProduct } from './colored-product.entity';
import { ProductUnit } from './enums';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 25, scale: 8 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ProductUnit
  })
  unit: ProductUnit;

  @Column({ type: 'decimal', precision: 20, scale: 6 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 25, scale: 6 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 25, scale: 6, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 25, scale: 6, default: 0 })
  finalPrice: number;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: number;

  @ManyToOne(() => ColoredProduct, { nullable: true })
  @JoinColumn({ name: 'coloredProductId' })
  coloredProduct: ColoredProduct;

  @Column({ nullable: true })
  coloredProductId: number;
} 