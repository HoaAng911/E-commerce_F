import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entity/artical.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  async create(dto: CreateArticleDto, authorId: any) {
    const slug = slugify(dto.title, { lower: true, locale: 'vi' }) + '-' + Date.now();
    
    const article = this.articleRepo.create({
      ...dto,
      slug,
      author: { id: authorId } as any,
    });
    
    return this.articleRepo.save(article);
  }

  async findAll() {
    return this.articleRepo.find({
      where: { isActive: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepo.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    
    // Tăng lượt xem mỗi khi đọc
    article.views += 1;
    await this.articleRepo.save(article);
    
    return article;
  }
}