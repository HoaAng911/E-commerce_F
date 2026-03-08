import { ArticalModule } from './artical/artical.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './categories/categories.module';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { ProductsModule } from './product/products.module';
import { Review } from './review/entity/review.entity';
import { User } from './user/entity/user.entity';
import { Product } from './product/entity/product.entity';
import { Category } from './categories/entity/categories.entity';
import { CartModule } from './cart/cart.module';
import { CartItem } from './cart/entity/cart-item.entity';
import { Cart } from './cart/entity/cart.entity';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { Order } from './order/entity/order.entity';
import { OrderItem } from './order/entity/order-item.entity';
import { Article } from './artical/entity/artical.entity';


@Module({
  imports: [
    ArticalModule, 
    AuthModule,
    UserModule,
    CategoriesModule,
    OrderModule,
    CartModule,
    ConfigModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       name: 'auth',
    //       ttl: 60000,
    //       limit: 10,
    //     },
    //   ],
    // })

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        entities: [
          User,
          Review,
          Product,
          Category,
          CartItem,
          Cart,
          Order,
          OrderItem,
          Article
        ],
        synchronize: true,
      }),
    }),
  ],
  // providers: [
  
  //   {
  //     provide: APP_GUARD,
  //     useClass: ThrottlerGuard
  //   }
  // ]
})
export class AppModule { }