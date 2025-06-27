import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductUnit } from '../../database/entities/enums';

export class OrderItemDto {
  @IsNumber()
  coloredProductId: number;

  @IsNumber()
  @Min(0.001)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  expectedDeliveryDate?: string;
}

export class AddOrderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
} 