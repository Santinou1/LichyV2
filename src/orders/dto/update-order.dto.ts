import { IsEnum, IsOptional, IsString, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { OrderStatus, OrderDestination } from '../../database/entities/enums';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(OrderDestination)
  destination?: OrderDestination;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;
} 