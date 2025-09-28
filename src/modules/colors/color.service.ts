import { Repository } from 'typeorm';
import { Color } from './entity/color.entity';
import { Product } from '@/modules/products/entity/product.entity';
import { AppDataSource } from '@/config/database.config';
import { CreateColorDto, ColorResponseDto, UpdateColorDto } from './dto/color.dto';
import { AppError } from '@/common/error.response';
import { ErrorMessages } from '@/constants/message';
import { HttpStatusCode } from '@/constants/status-code';
import { ErrorCode } from '@/constants/error-code';
import { ColorMapper } from './color.mapper';

export class ColorService {
	private colorRepository: Repository<Color>;

	constructor() {
		this.colorRepository = AppDataSource.getRepository(Color);
	}

	async createColor(data: CreateColorDto): Promise<ColorResponseDto> {
		try {
			const exists = await this.colorRepository.findOne({ where: { name_color: data.name_color } });
			if (exists) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_ALREADY_EXISTS,
					HttpStatusCode.BAD_REQUEST,
					ErrorCode.COLOR_ALREADY_EXISTS
				);
			}
			const color = this.colorRepository.create();
			if (data.product_id) {
				const productRepo = AppDataSource.getRepository(Product);
				const product = await productRepo.findOne({ where: { id: data.product_id } });
				if (!product) {
					throw new AppError(
						ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
						HttpStatusCode.NOT_FOUND,
						ErrorCode.PRODUCT_NOT_FOUND
					);
				}
				color.product = product;
			}

			color.name_color = data.name_color;
			const result = await this.colorRepository.save(color);
			const saved = Array.isArray(result) ? result[0] : result;
			return ColorMapper.toColorResponseDto(saved as Color);

		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessages.COLORS.CREATE_COLOR_FAILED,
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				ErrorCode.SERVER_ERROR,
				error
			);
		}
	}

	async getAllColors(): Promise<ColorResponseDto[]> {
		try {
			const colors = await this.colorRepository.find({
        order: { id: 'ASC' },
        relations: ['product']
            });
			return ColorMapper.toColorResponseDtoList(colors);
		} catch (error) {
			throw new AppError(
				ErrorMessages.COLORS.FAILED_TO_FETCH_COLORS,
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				ErrorCode.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getColorById(id: number): Promise<ColorResponseDto> {
		try {
			const color = await this.colorRepository.findOne({
                 where: { id },
                 relations: ['product']
            });
			if (!color) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_NOT_FOUND,
					HttpStatusCode.NOT_FOUND,
					ErrorCode.COLOR_NOT_FOUND
				);
			}
			return ColorMapper.toColorResponseDto(color);
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessages.COLORS.FAILED_TO_FETCH_COLOR_BY_ID,
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				ErrorCode.INTERNAL_SERVER_ERROR,
				error
			);
		}
	}

	async updateColor(id: number, data: UpdateColorDto): Promise<ColorResponseDto> {
		try {
			const color = await this.colorRepository.findOne({ 
                where: { id },
                relations: ['product']
            });
			if (!color) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_NOT_FOUND,
					HttpStatusCode.NOT_FOUND,
					ErrorCode.COLOR_NOT_FOUND
				);
			}
			Object.assign(color, data);
			const result = await this.colorRepository.save(color);
			const saved = Array.isArray(result) ? result[0] : result;
			return ColorMapper.toColorResponseDto(saved as Color);
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessages.COLORS.FAILED_TO_UPDATE_COLOR,
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				ErrorCode.SERVER_ERROR,
				error
			);
		}
	}

	async deleteColor(id: number): Promise<void> {
		try {
			const color = await this.colorRepository.findOne({
                where: { id },
                relations: ['product']
            });
			if (!color) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_NOT_FOUND,
					HttpStatusCode.NOT_FOUND,
					ErrorCode.COLOR_NOT_FOUND
				);
			}
			await this.colorRepository.remove(color);
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessages.COLORS.FAILED_TO_DELETE_COLOR,
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				ErrorCode.SERVER_ERROR,
				error
			);
		}
	}
}

export default new ColorService();
