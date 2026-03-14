import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Product } from 'src/product/entity/product.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) { }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lấy giỏ hàng và các item được chọn
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      const selectedItems = cart?.items.filter(item => item.selected) || [];
      if (selectedItems.length === 0) {
        throw new BadRequestException('Giỏ hàng trống hoặc không có sản phẩm nào được chọn');
      }

      // 2. Kiểm tra tồn kho và tính tổng tiền
      let totalAmount = 0;
      for (const item of selectedItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${item.product.name} không đủ tồn kho`);
        }
        totalAmount += Number(item.price) * item.quantity;
      }

      // 3. Tạo đơn hàng mới
      const order = queryRunner.manager.create(Order, {
        user: { id: userId },
        totalAmount,
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        note: dto.note,
        paymentMethod: dto.paymentMethod,
      });
      const savedOrder = await queryRunner.manager.save(order);

      // 4. Tạo OrderItems & Trừ tồn kho
      const orderItems = selectedItems.map(item => {
        // Cập nhật số lượng tồn kho và số lượng đã bán
        item.product.stock -= item.quantity;
        item.product.soldCount += item.quantity;

        return queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        });
      });

      await queryRunner.manager.save(OrderItem, orderItems);
      await queryRunner.manager.save(Product, selectedItems.map(i => i.product));

      // 5. Xóa các item đã đặt khỏi giỏ hàng
      await queryRunner.manager.remove(selectedItems);

      await queryRunner.commitTransaction();
      return savedOrder;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyOrders(userId: string) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string, userId: string) {
  const order = await this.orderRepository.findOne({
    where: { id: orderId, user: { id: userId } },
    relations: ['items', 'items.product'],
  });

  if (!order) {
    throw new NotFoundException('Không tìm thấy đơn hàng');
  }
  return order;
}

// Hủy đơn hàng
async cancelOrder(orderId: string, userId: string) {
  const order = await this.getOrderById(orderId, userId);

  if (order.status !== 'pending') {
    throw new BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xử lý');
  }

  // Hoàn trả tồn kho nếu cần thiết
  for (const item of order.items) {
    if (item.product) {
      await this.productRepository.update(item.product.id, {
        stock: item.product.stock + item.quantity,
        soldCount: item.product.soldCount - item.quantity,
      });
    }
  }

  order.status = OrderStatus.CANCELLED;
  return this.orderRepository.save(order);
}
// Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: string, status: OrderStatus, userId?: string) {
    const whereCondition: any = { id: orderId };
    if (userId) {
      whereCondition.user = { id: userId };
    }
    
    const order = await this.orderRepository.findOne({
      where: whereCondition,
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}
