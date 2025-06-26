import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ContainerProduct } from './container-product.entity';
import { ContainerMovement } from './container-movement.entity';
import { ContainerCategory, ContainerLocation } from './enums';

@Entity('containers')
export class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Ej: "LTS-3010", "MITRE-001", "LICHY-001"

  @Column()
  supplier: string;

  @Column({
    type: 'enum',
    enum: ContainerCategory,
    default: ContainerCategory.CREADO
  })
  category: ContainerCategory;

  @Column({
    type: 'enum',
    enum: ContainerLocation,
    default: ContainerLocation.NUEVO
  })
  location: ContainerLocation;

  @Column({ type: 'decimal', precision: 20, scale: 6, nullable: true })
  fob: number; // FOB con alta precisión para valores monetarios

  @Column({ nullable: true })
  supplierItem: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => ContainerProduct, containerProduct => containerProduct.container)
  containerProducts: ContainerProduct[];

  @OneToMany(() => ContainerMovement, movement => movement.container)
  movements: ContainerMovement[];
} 