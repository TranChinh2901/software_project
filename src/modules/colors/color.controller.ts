import { Request, Response, NextFunction } from 'express';
import colorService from './color.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
import { AppResponse } from '@/common/success.response';
import { SuccessMessages } from '@/constants/message';
import { HttpStatusCode } from '@/constants/status-code';
import { AppError } from '@/common/error.response';
import { ErrorCode } from '@/constants/error-code';

export class ColorController {
	async createColor(req: Request, res: Response, next: NextFunction) {
		try {
			const { name_color, product_id } = req.body;
			const dto: CreateColorDto = { name_color, product_id };
			const color = await colorService.createColor(dto);
			return new AppResponse({
				message: SuccessMessages.COLORS.COLOR_CREATED,
				statusCode: HttpStatusCode.CREATED,
				data: color,
			}).sendResponse(res);
		} catch (error) {
			next(error);
		}
	}

	async getAllColors(req: Request, res: Response, next: NextFunction) {
		try {
			const colors = await colorService.getAllColors();
			return new AppResponse({
				message: SuccessMessages.COLORS.COLOR_LIST_GET,
				statusCode: HttpStatusCode.OK,
				data: colors,
			}).sendResponse(res);
		} catch (error) {
			next(error);
		}
	}

	async getColorById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const colorId = parseInt(id);
			if (isNaN(colorId)) {
				throw new AppError('Invalid color id', HttpStatusCode.BAD_REQUEST, ErrorCode.INVALID_PARAMS);
			}
			const color = await colorService.getColorById(colorId);
			return new AppResponse({
				message: SuccessMessages.COLORS.COLOR_GET,
				statusCode: HttpStatusCode.OK,
				data: color,
			}).sendResponse(res);
		} catch (error) {
			next(error);
		}
	}

	async updateColor(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const colorId = parseInt(id);
			if (isNaN(colorId)) {
				throw new AppError('Invalid color id', HttpStatusCode.BAD_REQUEST, ErrorCode.INVALID_PARAMS);
			}
			const { name_color, product_id } = req.body;
			const dto: UpdateColorDto = { name_color, product_id };
			const updated = await colorService.updateColor(colorId, dto);
			return new AppResponse({
				message: SuccessMessages.COLORS.COLOR_UPDATED,
				statusCode: HttpStatusCode.OK,
				data: updated,
			}).sendResponse(res);
		} catch (error) {
			next(error);
		}
	}

	async deleteColor(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const colorId = parseInt(id);
			if (isNaN(colorId)) {
				throw new AppError('Invalid color id', HttpStatusCode.BAD_REQUEST, ErrorCode.INVALID_PARAMS);
			}
			await colorService.deleteColor(colorId);
			return new AppResponse({
				message: SuccessMessages.COLORS.COLOR_DELETED,
				statusCode: HttpStatusCode.OK,
				data: null,
			}).sendResponse(res);
		} catch (error) {
			next(error);
		}
	}
}

export default new ColorController();
