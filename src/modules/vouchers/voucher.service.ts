import { Repository } from "typeorm";
import { Voucher } from "./entity/voucher.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateVoucherDto, UpdateVoucherDto, VoucherResponseDto } from "./dto/voucher.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { VoucherMapper } from "./voucher.mapper";

export class VoucherService { 
    private voucherReponsitory: Repository<Voucher>;

    constructor() {
        this.voucherReponsitory= AppDataSource.getRepository(Voucher);
    }

    async createVoucher(createVoucherDto: CreateVoucherDto): Promise<VoucherResponseDto> {
        try {
            const existingVoucher = await this.voucherReponsitory.findOne({
                where: { code: createVoucherDto.code }
            })
            if(existingVoucher) {
                throw new AppError(
                    ErrorMessages.VOUCHER.VOUCHER_CODE_ALREADY_EXISTS,
                    HttpStatusCode.CONFLICT,
                    ErrorCode.VOUCHER_ALREADY_EXISTS
                )
            }
            const voucher = this.voucherReponsitory.create(createVoucherDto);
            const savedVoucher = await this.voucherReponsitory.save(voucher);
            return VoucherMapper.toVoucherResponseDto(savedVoucher);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.VOUCHER.CREATE_VOUCHER_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getAllVouchers(): Promise<VoucherResponseDto[]> {
        try {
            const vouchers = await this.voucherReponsitory.find({
                order: { expiry_date: 'DESC' }
            });
            return VoucherMapper.toVoucherResponseDtoList(vouchers);
        } catch (error) {
            throw new AppError(
                ErrorMessages.VOUCHER.FAILED_TO_FETCH_VOUCHER,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getVoucherById(id: number): Promise<VoucherResponseDto> {
        try {
            const voucher = await this.voucherReponsitory.findOne({
                where: { id }
            });

            if (!voucher) {
                throw new AppError(
                    ErrorMessages.VOUCHER.VOUCHER_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.VOUCHER_NOT_FOUND
                );
            }

            return VoucherMapper.toVoucherResponseDto(voucher);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.VOUCHER.FAILED_TO_FETCH_VOUCHER_BY_ID,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateVoucher(id: number, updateVoucherDto: UpdateVoucherDto): Promise<VoucherResponseDto> {
        try {
            const voucher = await this.voucherReponsitory.findOne({
                where: { id }
            });

            if (!voucher) {
                throw new AppError(
                    ErrorMessages.VOUCHER.VOUCHER_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.VOUCHER_NOT_FOUND
                );
            }

            if (updateVoucherDto.code && updateVoucherDto.code !== voucher.code) {
                const existingVoucher = await this.voucherReponsitory.findOne({
                    where: { code: updateVoucherDto.code }
                });

                if (existingVoucher) {
                    throw new AppError(
                        ErrorMessages.VOUCHER.VOUCHER_CODE_ALREADY_EXISTS,
                        HttpStatusCode.CONFLICT,
                        ErrorCode.VOUCHER_ALREADY_EXISTS
                    );
                }
            }

            Object.assign(voucher, updateVoucherDto);
            const updatedVoucher = await this.voucherReponsitory.save(voucher);
            return VoucherMapper.toVoucherResponseDto(updatedVoucher);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.VOUCHER.FAILED_UPDATE_VOUCHER,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteVoucher(id: number): Promise<void> {
        try {
            const voucher = await this.voucherReponsitory.findOne({
                where: { id }
            });

            if (!voucher) {
                throw new AppError(
                    ErrorMessages.VOUCHER.VOUCHER_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.VOUCHER_NOT_FOUND
                );
            }

            await this.voucherReponsitory.remove(voucher);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.VOUCHER.FAILED_DELETE_VOUCHER,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async validateVoucherCode(code: string, orderValue: number): Promise<VoucherResponseDto> {
        try {
            const voucher = await this.voucherReponsitory.findOne({
                where: { code: code.toUpperCase() }
            });

            if (!voucher) {
                throw new AppError(
                    "Mã voucher không tồn tại",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.VOUCHER_NOT_FOUND
                );
            }

            // Check if voucher is active
            if (voucher.status !== 'active') {
                throw new AppError(
                    "Mã voucher đã bị vô hiệu hóa",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.VOUCHER_INACTIVE
                );
            }

            // Check if voucher is expired
            const now = new Date();
            const expiryDate = new Date(voucher.expiry_date);
            if (expiryDate < now) {
                throw new AppError(
                    "Mã voucher đã hết hạn",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.VOUCHER_EXPIRED
                );
            }

            // Check if voucher quantity is available
            if (voucher.quantity <= 0) {
                throw new AppError(
                    "Mã voucher đã hết lượt sử dụng",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.VOUCHER_OUT_OF_STOCK
                );
            }

            // Check minimum order value
            if (voucher.min_order_value && orderValue < voucher.min_order_value) {
                throw new AppError(
                    `Đơn hàng tối thiểu phải từ ${voucher.min_order_value.toLocaleString('vi-VN')} ₫`,
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.ORDER_VALUE_TOO_LOW
                );
            }

            return VoucherMapper.toVoucherResponseDto(voucher);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Không thể xác thực mã voucher",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export default new VoucherService();