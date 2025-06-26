import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ContainerCategory, ContainerLocation } from '../../database/entities/enums';

export class ChangeContainerStatusDto {
  @IsEnum(ContainerCategory)
  newCategory: ContainerCategory;

  @IsEnum(ContainerLocation)
  newLocation: ContainerLocation;

  @IsString()
  @IsNotEmpty()
  notes: string; // COMENTARIO OBLIGATORIO

  @IsOptional()
  @IsString()
  movementDate?: string; // Fecha del movimiento (opcional, por defecto hoy)
} 