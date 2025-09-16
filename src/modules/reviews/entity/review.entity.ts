import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { Product } from "@/modules/products/entity/product.entity";

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', width: 1 })
  rating!: number; // 1-5 stars

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
