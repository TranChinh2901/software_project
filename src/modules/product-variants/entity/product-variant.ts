import { SizeType } from './../../../constants/size-type';

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "@/modules/products/entity/product.entity";
import { Color } from "@/modules/colors/entity/color.entity";

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;
  // @Column({ 
  //   type: 'enum', 
  //   enum: ['S', 'M', 'L', 'XL'], 
  //   nullable: true 
  // })
  // size?: string;

  @Column({type: 'enum', enum: SizeType, default: SizeType.M, nullable: true})
  size?: SizeType;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'color_id' })
  color?: Color;
}
