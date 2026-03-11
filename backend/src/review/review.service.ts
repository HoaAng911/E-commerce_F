import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,DataSource } from 'typeorm';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { Product } from 'src/product/entity/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Tạo review
      const review = manager.create(Review, createReviewDto);
      const savedReview = await manager.save(review);

      // 2. Tính toán lại rating cho Product
      const { productId } = createReviewDto;
      const stats = await manager
        .createQueryBuilder(Review, 'review')
        .select('AVG(review.rating)', 'avg')
        .addSelect('COUNT(review.id)', 'count')
        .where('review.productId = :productId', { productId })
        .getRawOne();

      // 3. Cập nhật vào bảng Product
      await manager.update(Product, productId, {
        rating: parseFloat(stats.avg) || 0,
        reviewCount: parseInt(stats.count) || 0,
      });

      return savedReview;
    });
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find();
  }
  async findByProduct(productId: string): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { productId },
      relations: ['user'], // Để lấy tên người dùng (displayName/name)
      order: { createdAt: 'DESC' }, // Review mới nhất lên đầu
    });
  }
  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewsRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Review not found');
  }
}