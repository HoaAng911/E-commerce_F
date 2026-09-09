// AppModule - main application module
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './categories/categories.module';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { ProductsModule } from './product/products.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

import { ReviewsModule } from './review/review.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ArticleModule,
    AuthModule,
    UserModule,
    CategoriesModule,
    OrderModule,
    CartModule,
    ReviewsModule,
    CloudinaryModule,
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
        autoLoadEntities: true,
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