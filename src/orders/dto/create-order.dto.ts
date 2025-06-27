import { IsEnum, IsOptional, IsString, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { OrderDestination } from '../../database/entities/enums';

export class CreateOrderDto {
  @IsEnum(OrderDestination)
  destination: OrderDestination;

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