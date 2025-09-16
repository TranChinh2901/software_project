
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  name_color!: string;
}
