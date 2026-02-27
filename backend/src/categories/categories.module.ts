
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { Category } from './entity/categories.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category,]),
    ],
    controllers: [CategoriesController,],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule { }