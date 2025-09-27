import { NextFunction, Request, Response } from "express";
import voucherService from "./voucher.service";
import { CreateVoucherDto, UpdateVoucherDto } from "./dto/voucher.dto";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { SuccessMessages } from "@/constants/message";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class VoucherController {
  async createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const createVoucherDto: CreateVoucherDto = req.body;
        
        const voucher = await voucherService.createVoucher(createVoucherDto);

        return new AppResponse({
            message: SuccessMessages.VOUCHER.VOUCHER_CREATED,
            statusCode: HttpStatusCode.CREATED,
            data: voucher
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
  }

  async getAllVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const vouchers = await voucherService.getAllVouchers();

        return new AppResponse({
            message: SuccessMessages.VOUCHER.VOUCHER_LIST_GET,
            statusCode: HttpStatusCode.OK,
            data: vouchers
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
  }

  async getVoucherById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucherId = parseInt(id);

        if (isNaN(voucherId)) {
            throw new AppError(
                "Invalid voucher ID",
                HttpStatusCode.BAD_REQUEST,
                ErrorCode.INVALID_PARAMS
            );
        }

        const voucher = await voucherService.getVoucherById(voucherId);

        return new AppResponse({
            message: SuccessMessages.VOUCHER.VOUCHER_LIST_BY_ID,
            statusCode: HttpStatusCode.OK,
            data: voucher
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
  }

  async updateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucherId = parseInt(id);

        if (isNaN(voucherId)) {
            throw new AppError(
                "Invalid voucher ID",
                HttpStatusCode.BAD_REQUEST,
                ErrorCode.INVALID_PARAMS
            );
        }

        const updateVoucherDto: UpdateVoucherDto = req.body;
        const voucher = await voucherService.updateVoucher(voucherId, updateVoucherDto);

        return new AppResponse({
            message: SuccessMessages.VOUCHER.VOUCHER_UPDATED,
            statusCode: HttpStatusCode.OK,
            data: voucher
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
  }

  async deleteVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucherId = parseInt(id);

        if (isNaN(voucherId)) {
            throw new AppError(
                "Invalid voucher ID",
                HttpStatusCode.BAD_REQUEST,
                ErrorCode.INVALID_PARAMS
            );
        }
        await voucherService.deleteVoucher(voucherId);

        return new AppResponse({
            message: SuccessMessages.VOUCHER.VOUCHER_DELETED,
            statusCode: HttpStatusCode.OK,
            data: null
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
  }
}

export default new VoucherController();
