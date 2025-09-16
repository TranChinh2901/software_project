import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";

@Entity('shipping_address')
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ length: 100 })
  fullname!: string;

  @Column({ length: 20 })
  phone_number!: string;

  @Column({ length: 255 })
  address!: string;

  @Column({ 
    type: 'enum', 
    enum: ['Văn phòng', 'Nhà riêng'], 
    default: 'Nhà riêng' 
  })
  type_address!: string;

  @Column({ type: 'boolean', default: false })
  is_default!: boolean;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
