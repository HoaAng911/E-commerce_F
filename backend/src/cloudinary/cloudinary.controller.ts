import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards, 
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('upload')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file')) // Key gửi lên từ form-data phải là 'file'
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|gif|avif)' }),
        ],
      }),
    ) file: any,
  ) {
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      return { 
        statusCode: 200, 
        message: 'Upload ảnh lên mây thành công',
        url: result.secure_url,
        public_id: result.public_id 
      };
    } catch (error) {
       throw new BadRequestException('Upload ảnh thất bại', error.message);
    }
  }
}
