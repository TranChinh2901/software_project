import { VoucherResponseDto } from "./dto/voucher.dto";
import { Voucher } from "./entity/voucher.entity";

export class VoucherMapper {
    static toVoucherResponseDto(voucher: Voucher): VoucherResponseDto {
        return {
            id: voucher.id,
            code: voucher.code,
            discount_voucher: voucher.discount_voucher,
            expiry_date: voucher.expiry_date,
            status: voucher.status,
            min_order_value: voucher.min_order_value,
            max_discount: voucher.max_discount,
            quantity: voucher.quantity
        }
    } 
    static toVoucherResponseDtoList(vouchers: Voucher[]): VoucherResponseDto[]{
        return vouchers.map((voucher) => VoucherMapper.toVoucherResponseDto(voucher));
    }
}