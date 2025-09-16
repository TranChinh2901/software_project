import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

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
}
