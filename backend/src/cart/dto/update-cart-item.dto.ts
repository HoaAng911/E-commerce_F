// src/cart/dto/update-cart-item.dto.ts
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class UpdateCartItemDto {
  @IsUUID()
  cartItemId: string;
  @IsInt()
  @Min(0)
  @Max(100)
  quantity: number;
}