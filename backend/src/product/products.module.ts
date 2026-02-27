
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { Category } from '../categories/entity/categories.entity';
import { Review } from '../review/entity/review.entity';
import { User } from 'src/user/entity/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Review, User]),
  ],
  controllers: [ProductsController,],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }