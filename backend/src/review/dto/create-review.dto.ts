
import { IsString, IsInt, Min, Max, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  comment: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isVerifiedPurchase?: boolean;

  @IsUUID()
  productId: string;

  @IsUUID()
  userId: string;
}