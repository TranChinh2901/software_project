import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { ProductVariant } from "@/modules/product-variants/entity/product-variant";

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'product_variant_id' })
  product_variant!: ProductVariant;
}