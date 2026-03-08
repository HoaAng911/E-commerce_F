import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string; 

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}