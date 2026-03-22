import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryProvider: typeof cloudinary,
  ) {}

  uploadFile(file: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shoes_store',
          resource_type: 'auto',
          unique_filename: true,
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

   
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null); // Kết thúc stream
      readable.pipe(uploadStream);
    });
  }
}
