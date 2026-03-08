import { IsString, IsNotEmpty } from 'class-validator';


export class GoogleCredentialDto {

  @IsString({ message: 'Credential phải là chuỗi' })
  @IsNotEmpty({ message: 'Credential là bắt buộc' })
  credential: string;
}