// import { Role } from "@/modules/roles/entity/role.entity";
// import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";


// @Entity('users')
// export class User {
//   @PrimaryColumn()
//   username!: string;

//   @Column()
//   password_hash!: string;

//   @Column()
//   fullname!: string;

//   @Column({ nullable: true })
//   avatar_url?: string;

//   @Column()
//   email!: string;

//   @Column()
//   phonenumber!: string;

//   @Column()
//   create_at!: Date;

//   @Column()
//   role_id!: string;

//   @OneToOne(() => Role)
//   @JoinColumn({ name: 'role_id' })
//   role!: Role;

//   @Column({ type: 'boolean', default: false })
//   is_deleted!: boolean;
// }

import { Role } from "@/modules/roles/entity/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ length: 100 })
  fullname!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 20, nullable: true })
  phone_number?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
