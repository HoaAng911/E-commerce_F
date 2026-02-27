// review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entity/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  comment: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  size: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  color: string;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  // THÊM FOREIGN KEY COLUMNS
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'uuid' })
  userId: string;


  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}