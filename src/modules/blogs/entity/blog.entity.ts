import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column('longtext', { nullable: true })
  content?: string;

  @Column({ length: 255, nullable: true })
  image_blogs?: string;

  @Column({ type: 'int' })
  author_id!: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status!: string;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author!: User;
}
