import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "@/modules/categories/entity/category.entity";
import { Brand } from "@/modules/brands/entity/brand.entity";
import { ProductType } from "../enum/product.enum";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, unique: true })
  name_product!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  origin_price?: number;

  @Column({ length: 255, nullable: true })
  small_description?: string;

  @Column("longtext", { nullable: true })
  meta_description?: string;

 @Column({ nullable: true })
  image_product?: string;

  @Column({ type: "enum", enum: ProductType, default: ProductType.ACTIVE })
  status!: ProductType;

  @Column({ type: "int", nullable: true })
  stock_quantity?: number;

 @Column({ type: "int", nullable: true })
  discount?: number;

  @Column({ type: "boolean", default: false })
  is_on_sale!: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id" })
  brand?: Brand;

  @Column({ type: "boolean", default: false })
  is_deleted!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
