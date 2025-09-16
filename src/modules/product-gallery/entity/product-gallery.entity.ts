import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "@/modules/products/entity/product.entity";

@Entity('product_gallery')
export class ProductGallery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  image_url!: string;

  @Column({ type: 'int' })
  product_id!: number;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
