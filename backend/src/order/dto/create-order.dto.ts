import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string = 'COD';
}