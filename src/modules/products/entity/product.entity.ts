import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "@/modules/categories/entity/category.entity";
import { Brand } from "@/modules/brands/entity/brand.entity";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name_product!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  original_price!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_price?: number;

  @Column()
  stock_quantity!: number;

  @Column('json', { nullable: true })
  images?: string[];

  @Column()
  category_id!: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column()
  brand_id!: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  // Thông tin đặc biệt cho quần áo
  @Column('json', { nullable: true })
  sizes?: string[]; // ["S", "M", "L", "XL", "XXL"]

  @Column('json', { nullable: true })
  colors?: string[]; // ["Đỏ", "Xanh", "Đen", "Trắng"]

  @Column({ nullable: true })
  gender?: string; // "Nam", "Nữ", "Unisex"

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
