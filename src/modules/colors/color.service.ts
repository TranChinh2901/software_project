import { Repository } from 'typeorm';
import { Color } from './entity/color.entity';
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
			// Check if color already exists (case-insensitive)
			const exists = await this.colorRepository
				.createQueryBuilder('color')
				.where('LOWER(color.name_color) = LOWER(:name)', { name: data.name_color })
				.getOne();

			if (exists) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_ALREADY_EXISTS,
					HttpStatusCode.BAD_REQUEST,
					ErrorCode.COLOR_ALREADY_EXISTS
				);
			}

			const color = this.colorRepository.create({
				name_color: data.name_color,
				hex_code: data.hex_code
			});

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
				order: { name_color: 'ASC' }
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
				where: { id }
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
			const color = await this.colorRepository.findOne({ where: { id } });
			if (!color) {
				throw new AppError(
					ErrorMessages.COLORS.COLOR_NOT_FOUND,
					HttpStatusCode.NOT_FOUND,
					ErrorCode.COLOR_NOT_FOUND
				);
			}

			// Check if new name conflicts with existing color
			if (data.name_color && data.name_color !== color.name_color) {
				const exists = await this.colorRepository
					.createQueryBuilder('color')
					.where('LOWER(color.name_color) = LOWER(:name)', { name: data.name_color })
					.andWhere('color.id != :id', { id })
					.getOne();

				if (exists) {
					throw new AppError(
						ErrorMessages.COLORS.COLOR_ALREADY_EXISTS,
						HttpStatusCode.BAD_REQUEST,
						ErrorCode.COLOR_ALREADY_EXISTS
					);
				}
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
			const color = await this.colorRepository.findOne({ where: { id } });
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
