import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/artical.entity';
import { User } from 'src/user/entity/user.entity';
import { ArticleController } from './artical.controller';
import { ArticleService } from './artical.service';

@Module({
    imports: [TypeOrmModule.forFeature([Article,User])],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticalModule { }
