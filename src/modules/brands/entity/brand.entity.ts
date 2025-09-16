import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
