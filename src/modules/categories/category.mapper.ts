import { CategoryResponseDto } from "./dto/category.dto";
import { Category } from "./entity/category.entity";

export class CategoryMapper {
    static toCategoryResponseDto(category: Category): CategoryResponseDto {
        return {
            id: category.id,
            name_category: category.name_category,
            image_category: category.image_category,
            description_category: category.description_category,
            updated_at: category.updated_at
        };
    }
    static toCategoryResponseDtoList(categories: Category[]): CategoryResponseDto[] {
        return categories.map((category) => CategoryMapper.toCategoryResponseDto(category));
    }
}