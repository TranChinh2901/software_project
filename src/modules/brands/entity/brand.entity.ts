import { Category } from "@/modules/categories/entity/category.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name_brand!: string;

  @Column({ nullable: true })
  logo_url?: string;

  @Column('longtext', { nullable: true })
  description_brand?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Category, category => category.brand)
  categories?: Category[];

  // @OneToMany(() => Product, product => product.brand)
  // products?: Product[];
}
