import { User } from "src/user/entity/user.entity";
import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderCode: string; // VD: ORD-1715832000-AB12 (Dùng để tra cứu thay vì UUID)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number; // Tổng tiền khách phải trả (đã bao gồm ship)

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingFee: number; // Tách riêng phí ship để tính lợi nhuận

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID
  })
  paymentStatus: PaymentStatus;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column('text')
  address: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: 'COD' })
  paymentMethod: string;

  @Column({ nullable: true })
  trackingCode: string; // Mã vận đơn của bên giao hàng (GHN, GHTK...)

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn() // Quan trọng: Giúp xóa đơn hàng mà không mất dữ liệu database
  deletedAt: Date;
}