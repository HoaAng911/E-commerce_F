import { Product } from "src/product/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // --- SNAPSHOT DATA ---
  @Column()
  productName: string; // Lưu tên SP lúc mua, lỡ sau này admin đổi tên SP gốc

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Giá bán lẻ tại thời điểm đặt hàng

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number; // Lưu số tiền được giảm giá trên mỗi item


  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  color: string;
}