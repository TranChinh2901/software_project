import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { Product } from "@/modules/products/entity/product.entity";

@Entity('reviews')
@Unique(['user', 'product']) 
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ 
    type: 'int', 
    comment: 'Rating from 1 to 5 stars',
    transformer: {
      to: (value: number) => Math.max(1, Math.min(5, value)), 
      from: (value: number) => value
    }
  })
  rating!: number; 

  @Column('text', { nullable: true })
  comment?: string;
  
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
