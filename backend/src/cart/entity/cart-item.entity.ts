// src/cart/entity/cart-item.entity.ts
import { Product } from "src/product/entity/product.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Max, Min } from "class-validator";

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.items, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Product, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'int', unsigned: true })
  @Min(1)
  @Max(100)
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; 

  @Column({ default: true })
  selected: boolean; 
  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  sku: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  getSubtotal(): number {
    return this.price * this.quantity;
  }
}