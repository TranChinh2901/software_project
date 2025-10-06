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

  // @Column({ type: 'boolean', default: false })
  // is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany(() => Category, category => category.brand)
  categories?: Category[];

  // Products qua Category, không cần direct relation
  // @OneToMany(() => Product, product => product.brand)
  // products?: Product[];
}
