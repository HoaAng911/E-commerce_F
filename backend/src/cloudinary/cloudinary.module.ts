import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryProvider, CloudinaryService], // Export ra nếu module khác (như ProductService) muốn gọi thẳng logic xóa/up ảnh
})
export class CloudinaryModule {}
