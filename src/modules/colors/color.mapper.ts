import { Color } from './entity/color.entity';
import { ColorResponseDto } from './dto/color.dto';

export class ColorMapper {
  static toColorResponseDto(color: Color): ColorResponseDto {
    return {
      id: color.id,
      name_color: color.name_color,
      product_id: color?.product?.id ?? null,
      product: {
        id: color?.product?.id ?? null,
        name: color?.product?.name_product ?? null
      }
    };
  }

  static toColorResponseDtoList(colors: Color[]): ColorResponseDto[] {
    return colors.map((c) => ColorMapper.toColorResponseDto(c));
  }
}

export default ColorMapper;
