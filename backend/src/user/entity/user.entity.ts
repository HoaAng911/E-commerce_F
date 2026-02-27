
import { Cart } from 'src/cart/entity/cart.entity';
import { Review } from 'src/review/entity/review.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('simple-array', { nullable: true })
  addresses: string[];

  @Column('simple-array', { nullable: true })
  wishlist: string[];
  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart; 

  @Column({ default: 'CUSTOMER' })
  role: 'ADMIN' | 'CUSTOMER';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
  @UpdateDateColumn()
  updatedAt: Date;
}