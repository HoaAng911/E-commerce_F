import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsUrl, MinLength, IsArray } from 'class-validator';

export class UpdateProfileDto {

  @IsOptional()
  @IsString()
  fullName?: string;



  @IsOptional()
  @IsString()
  phone?: string;


  @IsOptional()
  @IsUrl()
  avatar?: string;
  @IsOptional()
  @IsArray() 
  @IsString({ each: true })
  addresses?: string[];

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}