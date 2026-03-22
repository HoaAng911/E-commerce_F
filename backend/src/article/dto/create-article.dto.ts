import { IsNotEmpty, IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(10, { message: 'Tiêu đề phải từ 10 ký tự' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'Thumbnail phải là đường dẫn URL' })
  thumbnail?: string;
}