import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body,
  Param
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { SelectItemDto } from './dto/select-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add/:userId')
  async addToCart(
    @Param('userId') userId: string, 
    @Body() dto: AddToCartDto
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update/:userId')
  async updateItem(
    @Param('userId') userId: string,
    @Body() dto: UpdateCartItemDto
  ) {
    return this.cartService.updateCartItem(userId, dto);
  }

  @Patch('select/:userId')
  async selectItem(
    @Param('userId') userId: string,
    @Body() dto: SelectItemDto
  ) {
    return this.cartService.selectItem(userId, dto);
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }


  @Delete('item/:userId/:itemId')
  async removeItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string
  ) {
    return this.cartService.removeItem(userId, itemId);
  }
}