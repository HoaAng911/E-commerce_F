// products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // ==================== CRUD OPERATIONS ====================
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Endpoint pagination mới
  @Get('paginated')
  findAllWithPagination(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.productsService.findAllWithPagination(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
      category,
      brand,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      sortBy || 'createdAt',
      sortOrder || 'DESC',
    );
  }

  // Giữ nguyên endpoint cũ
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ==================== HOMEPAGE ENDPOINTS ====================
  @Get('homepage/data')
  getHomepageData() {
    return this.productsService.getHomepageData();
  }

  @Get('homepage/featured')
  getFeaturedProducts(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getFeaturedProducts(limitNumber);
  }

  @Get('homepage/new-arrivals')
  getNewArrivals(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getNewArrivals(limitNumber);
  }

  @Get('homepage/best-sellers')
  getBestSellers(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getBestSellers(limitNumber);
  }

  @Get('homepage/discounted')
  getDiscountedProducts(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getDiscountedProducts(limitNumber);
  }

  @Get('homepage/top-rated')
  getTopRatedProducts(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getTopRatedProducts(limitNumber);
  }

  @Get('homepage/flash-sale')
  getFlashSaleProducts(@Query('limit') limit?: number) {
    const limitNumber = limit ? Number(limit) : 8;
    return this.productsService.getFlashSaleProducts(limitNumber);
  }

  @Get('brand/:brandName')
  getProductsByBrand(
    @Param('brandName') brandName: string,
    @Query('limit') limit?: number
  ) {
    const limitNumber = limit ? Number(limit) : 6;
    return this.productsService.getProductsByBrand(brandName, limitNumber);
  }
}