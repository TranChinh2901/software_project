import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { Product } from "@/modules/products/entity/product.entity";

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  product_id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  quantity!: number;

  @Column({ nullable: true })
  selected_size?: string; // Size được chọn

  @Column({ nullable: true })
  selected_color?: string; // Màu được chọn

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
