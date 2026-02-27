import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { Product } from '../product/entity/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { SelectItemDto } from './dto/select-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }

  // 1. Lấy giỏ hàng
  async getCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    // Nếu chưa có cart thì tạo mới
    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId } });
      await this.cartRepo.save(cart);
      cart.items = [];
    }

    this.calculateTotals(cart);
    return this.formatCart(cart);
  }

  // 2. Thêm sản phẩm vào giỏ
  async addToCart(userId: string, dto: AddToCartDto) {
    // Lấy cart
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId } });
      await this.cartRepo.save(cart);
      cart.items = [];
    }

    // Lấy sản phẩm
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Kiểm tra tồn kho
    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Chỉ còn ${product.stock} sản phẩm trong kho`);
    }

    // Kiểm tra đã có trong giỏ chưa
    const existingItem = cart.items.find(
      item =>
        item.product.id === dto.productId &&
        item.size === dto.size &&
        item.color === dto.color
    );

    if (existingItem) {
      // Cập nhật số lượng
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      // Thêm mới
      const newItem = this.cartItemRepo.create({
        cart,
        product,
        productId: product.id,
        quantity: dto.quantity,
        price: product.price, // Lưu giá tại thời điểm thêm
        selected: true,
        size: dto.size,
        color: dto.color,
      });
      await this.cartItemRepo.save(newItem);
      cart.items.push(newItem);
    }

    // Tính toán lại
    this.calculateTotals(cart);
    await this.cartRepo.save(cart);

    return this.formatCart(cart);
  }

  // 3. Cập nhật số lượng
  async updateCartItem(userId: string, dto: UpdateCartItemDto) {
    const cart = await this.getUserCartWithItems(userId);
    const item = cart.items.find(item => item.id === dto.cartItemId);

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ');
    }

    // Nếu quantity = 0 thì xóa
    if (dto.quantity === 0) {
      await this.cartItemRepo.remove(item);
      cart.items = cart.items.filter(i => i.id !== dto.cartItemId);
    } else {
      // Kiểm tra tồn kho
      if (item.product.stock < dto.quantity) {
        throw new BadRequestException(`Chỉ còn ${item.product.stock} sản phẩm trong kho`);
      }
      item.quantity = dto.quantity;
      await this.cartItemRepo.save(item);
    }

    this.calculateTotals(cart);
    await this.cartRepo.save(cart);

    return this.formatCart(cart);
  }

  // 4. Chọn/bỏ chọn sản phẩm
  async selectItem(userId: string, dto: SelectItemDto) {
    const cart = await this.getUserCartWithItems(userId);
    const item = cart.items.find(item => item.id === dto.cartItemId);

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ');
    }

    item.selected = dto.selected;
    await this.cartItemRepo.save(item);

    this.calculateTotals(cart);
    await this.cartRepo.save(cart);

    return this.formatCart(cart);
  }
  async removeItem(userId: string, itemId: string) {
    const cart = await this.getUserCartWithItems(userId);
    const item = cart.items.find(item => item.id === itemId);

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ');
    }

    // Xóa item
    await this.cartItemRepo.remove(item);

    // Cập nhật cart
    cart.items = cart.items.filter(i => i.id !== itemId);
    this.calculateTotals(cart);
    await this.cartRepo.save(cart);

    return this.formatCart(cart);
  }
  // 5. Xóa toàn bộ giỏ hàng
  async clearCart(userId: string) {
    const cart = await this.getUserCartWithItems(userId);

    // Xóa tất cả items
    if (cart.items.length > 0) {
      await this.cartItemRepo.remove(cart.items);
    }

    // Reset cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
    await this.cartRepo.save(cart);

    return { message: 'Đã xóa giỏ hàng' };
  }

  // ========== HELPER METHODS ==========

  private async getUserCartWithItems(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const newCart = this.cartRepo.create({ user: { id: userId } });
      return await this.cartRepo.save(newCart);
    }

    return cart;
  }

  private calculateTotals(cart: Cart): void {
    const selectedItems = cart.items.filter(item => item.selected);

    cart.totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = selectedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  private formatCart(cart: Cart): any {
    return {
      id: cart.id,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      items: cart.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          mainImage: item.product.mainImage,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        price: item.price,
        selected: item.selected,
        size: item.size,
        color: item.color,
        subtotal: item.price * item.quantity,
      })),
    };
  }
}