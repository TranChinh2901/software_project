import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('cancel_order')
export class CancelOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  order_id!: number;

  @Column({ type: 'int', nullable: true })
  order_detail_id?: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column('text', { nullable: true })
  reason?: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  refund_amount?: number;

  @Column({
    type: 'enum',
    enum: ['requested', 'approved', 'rejected', 'refunded']
  })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at?: Date;
}
