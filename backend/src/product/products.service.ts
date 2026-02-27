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

  // Hàm pagination đơn giản
  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number; 
    limit: number; 
    totalPages: number 
  }> {
    
    // Tính toán skip
    const skip = (page - 1) * limit;
    
    // Tạo điều kiện where
    const whereConditions: any = { isActive: true };
    
    // Thêm các điều kiện filter
    if (search) {
      whereConditions.name = ILike(`%${search}%`);
    }
    
    if (category) {
      whereConditions.categoryId = category;
    }
    
    if (brand) {
      whereConditions.brand = ILike(`%${brand}%`);
    }
    
    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) {
        whereConditions.price = Between(minPrice, maxPrice);
      } else if (minPrice) {
        whereConditions.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice) {
        whereConditions.price = LessThanOrEqual(maxPrice);
      }
    }
    
    // Xác định order
    let order: any = {};
    if (sortBy === 'price') {
      order.price = sortOrder;
    } else if (sortBy === 'rating') {
      order.rating = sortOrder;
    } else if (sortBy === 'soldCount') {
      order.soldCount = sortOrder;
    } else if (sortBy === 'discountPercent') {
      order.discountPercent = sortOrder;
    } else {
      order.createdAt = sortOrder;
    }
    
    // Lấy tổng số items
    const total = await this.productsRepository.count({ where: whereConditions });
    
    // Lấy dữ liệu với pagination
    const products = await this.productsRepository.find({
      where: whereConditions,
      order: order,
      skip: skip,
      take: limit,
    });
    
    // Tính tổng số trang
    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Giữ nguyên hàm findAll cũ
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
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