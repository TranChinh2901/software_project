import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { BlogType } from "@/constants/blog-type";

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

@Column({type: 'enum', enum: BlogType, default: BlogType.ACTIVE})
status!: BlogType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author!: User;
}
