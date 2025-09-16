import { VoucherType } from "@/constants/cart-type";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  discount_voucher!: number;

  @Column({ type: 'date' })
  expiry_date!: Date;

  @Column({ type: 'enum', enum: VoucherType, default: VoucherType.ACTIVE })
  status!: VoucherType;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  min_order_value?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  max_discount?: number;

  @Column({ type: 'int', default: 0 })
  quantity!: number;
}
