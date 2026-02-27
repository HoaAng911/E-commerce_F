// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { Product } from '../product/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], 
})
export class CartModule {}