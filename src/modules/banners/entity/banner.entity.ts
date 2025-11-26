import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BannerType } from '../enum/banner.enum';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image_url!: string;

  @Column({ nullable: true })
  button_text?: string;

  @Column({ nullable: true })
  button_link?: string;

  @Column({
    type: 'enum',
    enum: BannerType,
    default: BannerType.ACTIVE
  })
  status!: BannerType;

  @Column({ default: 0 })
  display_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
