import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseGuards, 
  Req, 
  Patch, 
  Delete
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 1. Tạo đơn hàng mới từ giỏ hàng
  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.sub;
    return this.orderService.createOrder(userId, createOrderDto);
  }

  // 2. Lấy danh sách đơn hàng của tôi
  @Get('my-orders')
  async getMyOrders(@Req() req) {
    const userId = req.user.sub;
    return this.orderService.getMyOrders(userId);
  }

  // Lấy danh sách tất cả đơn hàng (cho Admin dashboard)
  @Get('all')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // 3. Lấy chi tiết một đơn hàng cụ thể
  @Get(':id')
  async getOrderDetails(@Req() req, @Param('id') orderId: string) {
    const userId = req.user.sub;
    // Bạn có thể thêm hàm findOne trong service để kiểm tra userId sở hữu order này
    return this.orderService.getOrderById(orderId, userId);
  }

  // 4. Hủy đơn hàng (Chỉ khi đang ở trạng thái PENDING)
  @Patch(':id/cancel')
  async cancelOrder(@Req() req, @Param('id') orderId: string) {
    const userId = req.user.sub;
    return this.orderService.cancelOrder(orderId, userId);
  }

  // Cập nhật trạng thái đơn hàng (Dành cho Admin)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string, 
    @Body('status') status: any
  ) {
    
    return this.orderService.updateOrderStatus(orderId, status);
  }
  @Delete(':id')
  async deleteOrder(@Req() req, @Param('id') orderId: string) {
    const userId = req.user.sub;
    // Gọi hàm softDelete mà chúng ta đã thảo luận trong Service
    return this.orderService.softDeleteOrder(orderId, userId);
  }
}