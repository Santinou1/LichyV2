import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Container } from './container.entity';
import { ContainerCategory, ContainerLocation } from './enums';

export enum ContainerMovementType {
  CAMBIO_CATEGORIA = 'cambio_categoria',
  CAMBIO_UBICACION = 'cambio_ubicacion',
  CAMBIO_AMBOS = 'cambio_ambos',
  CREACION = 'creacion',
  ANULACION = 'anulacion',
}

@Entity('container_movements')
export class ContainerMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ContainerMovementType
  })
  type: ContainerMovementType;

  // Estado anterior
  @Column({
    type: 'enum',
    enum: ContainerCategory,
    nullable: true
  })
  previousCategory: ContainerCategory;

  @Column({
    type: 'enum',
    enum: ContainerLocation,
    nullable: true
  })
  previousLocation: ContainerLocation;

  // Estado nuevo
  @Column({
    type: 'enum',
    enum: ContainerCategory
  })
  newCategory: ContainerCategory;

  @Column({
    type: 'enum',
    enum: ContainerLocation
  })
  newLocation: ContainerLocation;

  @Column({ type: 'text' })
  notes: string; // COMENTARIO OBLIGATORIO - Descripción detallada del cambio

  @Column({ type: 'date' })
  movementDate: Date;

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

  @ManyToOne(() => Container)
  @JoinColumn({ name: 'containerId' })
  container: Container;

  @Column()
  containerId: number;
} 