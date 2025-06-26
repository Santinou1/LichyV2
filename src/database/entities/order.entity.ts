import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus, OrderDestination } from './enums';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string; // Número de pedido único

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderDestination
  })
  destination: OrderDestination;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 25, scale: 6, default: 0 })
  totalAmount: number; // Monto total con alta precisión monetaria

  @Column({ type: 'decimal', precision: 25, scale: 6, default: 0 })
  subtotal: number; // Subtotal antes de impuestos

  @Column({ type: 'decimal', precision: 25, scale: 6, default: 0 })
  taxAmount: number; // Monto de impuestos

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number; // Porcentaje de impuesto (ej: 21.00)

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];
} 