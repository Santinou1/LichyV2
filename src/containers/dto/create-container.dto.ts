import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, ValidateNested, IsArray, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ContainerCategory, ContainerLocation, ProductUnit, ProductAlternativeUnit } from '../../database/entities/enums';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @IsNumber()
  @Min(0)
  totalQuantity: number;

  @IsOptional()
  @IsEnum(ProductAlternativeUnit)
  alternativeUnit?: ProductAlternativeUnit;

  @IsNumber()
  @Min(0)
  alternativeQuantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssociateProductDto {
  @IsNumber()
  productId: number;

  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @IsNumber()
  @Min(0)
  totalQuantity: number;

  @IsOptional()
  @IsEnum(ProductAlternativeUnit)
  alternativeUnit?: ProductAlternativeUnit;

  @IsNumber()
  @Min(0)
  alternativeQuantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ContainerProductDto {
  @IsBoolean()
  isNewProduct: boolean;

  @ValidateNested()
  @Type(() => CreateProductDto)
  @IsOptional()
  newProduct?: CreateProductDto;

  @ValidateNested()
  @Type(() => AssociateProductDto)
  @IsOptional()
  existingProduct?: AssociateProductDto;
}

export class CreateContainerDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  supplier: string;

  @IsOptional()
  @IsEnum(ContainerCategory)
  category?: ContainerCategory;

  @IsOptional()
  @IsEnum(ContainerLocation)
  location?: ContainerLocation;

  @IsOptional()
  @IsNumber()
  fob?: number;

  @IsOptional()
  @IsString()
  supplierItem?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContainerProductDto)
  products: ContainerProductDto[];
} 