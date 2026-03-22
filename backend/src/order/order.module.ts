import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { Product } from 'src/product/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, Product]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}