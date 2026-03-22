import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, MoreThan, Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { category, ...productData } = createProductDto;
    const product = this.productsRepository.create({
      ...productData,
      category: { id: category } as any,
    });
    return await this.productsRepository.save(product);
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'newest', // Mặc định là mới nhất
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    const whereConditions: any = { isActive: true };

    // 1. Xử lý Filters
    if (search) whereConditions.name = ILike(`%${search}%`);
    if (category) whereConditions.categoryId = category;
    if (brand) whereConditions.brand = ILike(`%${brand}%`);

    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) whereConditions.price = Between(minPrice, maxPrice);
      else if (minPrice) whereConditions.price = MoreThanOrEqual(minPrice);
      else if (maxPrice) whereConditions.price = LessThanOrEqual(maxPrice);
    }

    // 2. Xử lý Order 
    let order: any = {};
    switch (sortBy) {
      case 'price_asc': order.price = 'ASC'; break;
      case 'price_desc': order.price = 'DESC'; break;
      case 'popular': order.soldCount = 'DESC'; break;
      case 'rating': order.rating = 'DESC'; break;
      case 'newest':
      default:
        order.createdAt = 'DESC';
        break;
    }


    const [products, total] = await this.productsRepository.findAndCount({
      where: whereConditions,
      order: order,
      skip: skip,
      take: limit,
      relations: ['category'],
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Giữ nguyên hàm findAll cũ
  // Cập nhật hàm findAll để tránh trả về mảng quá lớn
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
      take: 50, // Giới hạn an toàn để tránh "sập" hệ thống
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { category, ...productData } = updateProductDto;

    // Gán các trường cơ bản
    Object.assign(product, productData);

    // Xử lý riêng trường category nếu có gửi lên
    if (category) {
      product.categoryId = category;
    }

    return await this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        isActive: true,
        isFeatured: true
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getBestSellers(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
      order: { soldCount: 'DESC' },
      take: limit,
    });
  }

  async getDiscountedProducts(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        isActive: true,
        discountPercent: MoreThan(0)
      },
      order: { discountPercent: 'DESC' },
      take: limit,
    });
  }

  async getTopRatedProducts(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  async getFlashSaleProducts(limit: number = 8): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        isActive: true,
        discountPercent: MoreThan(0)
      },
      order: { discountPercent: 'DESC' },
      take: limit,
    });
  }

  async getProductsByBrand(brand: string, limit: number = 6): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        isActive: true,
        brand: ILike(`%${brand}%`)
      },
      take: limit,
    });
  }
 
  async getSuggestions(search: string, limit: number = 5): Promise<Partial<Product>[]> {
    if (!search) return [];

    return await this.productsRepository.find({
      where: {
        name: ILike(`%${search}%`),
        isActive: true
      },
      select: ['id', 'name', 'mainImage', 'price'],
      take: limit,
    });
  }
  async getHomepageData(): Promise<{
    featured: Product[];
    newArrivals: Product[];
    bestSellers: Product[];
    discounted: Product[];
    topRated: Product[];
    flashSale: Product[];
  }> {
    const [
      featured,
      newArrivals,
      bestSellers,
      discounted,
      topRated,
      flashSale,
    ] = await Promise.all([
      this.getFeaturedProducts(8),
      this.getNewArrivals(8),
      this.getBestSellers(8),
      this.getDiscountedProducts(8),
      this.getTopRatedProducts(8),
      this.getFlashSaleProducts(8),
    ]);

    return {
      featured,
      newArrivals,
      bestSellers,
      discounted,
      topRated,
      flashSale,
    };
  }
}