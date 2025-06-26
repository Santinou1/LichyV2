import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, ValidateNested, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductUnit, ProductAlternativeUnit } from '../../database/entities/enums';

export class ColorDistributionDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsEnum(ProductAlternativeUnit)
  alternativeUnit?: ProductAlternativeUnit;

  @IsOptional()
  @IsNumber()
  @Min(0)
  alternativeQuantity?: number;
}

export class DistributeProductsDto {
  @IsNumber()
  containerProductId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDistributionDto)
  colorDistributions: ColorDistributionDto[];

  @IsString()
  @IsNotEmpty()
  notes: string;
} 