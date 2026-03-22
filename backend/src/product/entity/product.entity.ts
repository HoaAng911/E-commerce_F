import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Review } from '../../review/entity/review.entity';
import { Category } from 'src/categories/entity/categories.entity';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column()
  @Index({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Index()
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column('int', { nullable: true })
  discountPercent: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  @Index()
  soldCount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  @Index()
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column()
  mainImage: string;

  @Column('simple-array', { nullable: true })
  images: string[]; // Các ảnh phụ

  @Column('simple-array', { nullable: true })
  sizes: string[]; // ['39', '40', '41', '42']

  @Column('simple-array', { nullable: true })
  colors: string[]; // ['Đen', 'Trắng', 'Xám']

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid' })
  @Index()
  categoryId: string;

  @Column()
  @Index()
  brand: string; // 'Nike', 'Adidas', 'Biti's'

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ default: false })
  @Index()
  isFeatured: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
  @OneToMany('CartItem', 'product')
  cartItems: any[];


}