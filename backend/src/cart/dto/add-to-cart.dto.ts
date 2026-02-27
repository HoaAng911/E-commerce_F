import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;

  @IsOptional()
  size?: string;

  @IsOptional()
  color?: string;
}