import { Role } from "@/modules/roles/entity/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  fullname!: string;

    @Column({ unique: true })
  email!: string;

  @Column({ length: 20, nullable: true })
  phone_number?: string;
  
  @Column({nullable: true})
  address?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender!: string;

  @Column() 
  date_of_birth!: Date;

  @Column({ type: 'boolean', default: false })
  is_email_verified!: boolean;
  
  @Column({ type: 'boolean', default: false })
  is_phone_verified!: boolean;

  @Column()
  role_id!: number;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
