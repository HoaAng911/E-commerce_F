import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './review.service';
import { ReviewsController } from './review.controller';
import { Review } from './entity/review.entity';
import { Product } from '../product/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}