
import { Product } from "@/modules/products/entity/product.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  name_color!: string;

      @ManyToOne(() => Product)
      @JoinColumn({ name: 'product_id' })
      product!: Product;

}
