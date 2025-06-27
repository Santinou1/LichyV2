import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../database/entities/enums';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  comment: string; // Comentario obligatorio para todos los cambios de estado
} 