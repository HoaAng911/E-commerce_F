import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  mainImage: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsArray()
  sizes: string[];

  @IsArray()
  colors: string[];

  @IsString()
  category: string;

  @IsString()
  brand: string;
}