import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ default: true })
  is_active!: boolean;

  @Column({ default: 0 })
  display_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
