// src/cart/dto/select-item.dto.ts
import { IsUUID, IsBoolean } from 'class-validator';

export class SelectItemDto {
  @IsUUID()
  cartItemId: string;

  @IsBoolean()
  selected: boolean;
}