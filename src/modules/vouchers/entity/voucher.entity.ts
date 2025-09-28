
import { VoucherType } from "@/modules/orders/enum/order.enum";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

@Column('decimal', { precision: 10, scale: 2 })
discount_voucher!: number;

  @Column({ type: 'date' })
  expiry_date!: Date;

  @Column({ type: 'enum', enum: VoucherType, default: VoucherType.ACTIVE })
  status!: VoucherType;


  //điều kiện áp dụng nếu cần (ví dụ: đơn hàng từ 300K).
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  min_order_value?: number;

  @Column({ type: 'int', default: 0 })
  quantity!: number;


}
