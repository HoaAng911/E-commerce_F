import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
  PENDING = 'pending',     // Chờ xác nhận
  CONFIRMED = 'confirmed', // Đã xác nhận
  SHIPPING = 'shipping',   // Đang giao hàng
  DELIVERED = 'delivered', // Đã giao hàng
  CANCELLED = 'cancelled', // Đã hủy
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;


  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column('text')
  address: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: 'COD' }) // COD hoặc Online Payment
  paymentMethod: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}