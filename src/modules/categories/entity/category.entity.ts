import { Brand } from "@/modules/brands/entity/brand.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name_category!: string;

  @Column({ nullable: true })
  image_category?: string;

  @Column({ type: 'text', nullable: true })
  description_category?: string;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @OneToMany(() => Product, product => product.category)
  products?: Product[];

}
