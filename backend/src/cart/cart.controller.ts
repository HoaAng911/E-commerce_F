import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { SelectItemDto } from './dto/select-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.sub;
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(
    @Req() req,
    @Body() dto: AddToCartDto
  ) {
    const userId = req.user.sub;
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update')
  async updateItem(
    @Req() req,
    @Body() dto: UpdateCartItemDto
  ) {
    const userId = req.user.sub;
    return this.cartService.updateCartItem(userId, dto);
  }

  @Patch('select')
  async selectItem(
    @Req() req,
    @Body() dto: SelectItemDto
  ) {
    const userId = req.user.sub;
    return this.cartService.selectItem(userId, dto);
  }

  @Delete('clear')
  async clearCart(@Req() req) {
    const userId = req.user.sub;
    return this.cartService.clearCart(userId);
  }

  @Delete('item/:itemId')
  async removeItem(
    @Req() req,
    @Param('itemId') itemId: string
  ) {
    const userId = req.user.sub;
    return this.cartService.removeItem(userId, itemId);
  }
}