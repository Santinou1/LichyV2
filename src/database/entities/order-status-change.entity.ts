import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { OrderStatus } from './enums';

@Entity('order_status_changes')
export class OrderStatusChange {
  @PrimaryGeneratedColumn()
  id: number;

  // Estado anterior
  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: true
  })
  previousStatus: OrderStatus;

  // Estado nuevo
  @Column({
    type: 'enum',
    enum: OrderStatus
  })
  newStatus: OrderStatus;

  @Column({ type: 'text' })
  notes: string; // COMENTARIO OBLIGATORIO - Descripción detallada del cambio de estado

  @Column({ type: 'date' })
  changeDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedById' })
  changedBy: User;

  @Column()
  changedById: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;
} 