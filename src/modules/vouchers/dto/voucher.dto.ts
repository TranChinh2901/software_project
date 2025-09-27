import { VoucherType } from "@/modules/orders/enum/order.enum";

export interface CreateVoucherDto {
    code: string;
    discount_voucher: number;
    expiry_date: Date;
    status?: VoucherType;
    min_order_value?: number;
    quantity: number;
}

export interface UpdateVoucherDto {
    code?: string;
    discount_voucher?: number;
    expiry_date?: Date;
    status?: VoucherType;
    min_order_value?: number;
    quantity?: number;
}

export interface VoucherResponseDto {
    id: number;
    code: string;
    discount_voucher: number;
    expiry_date: Date;
    status: VoucherType;
    min_order_value?: number;
    quantity: number;
}