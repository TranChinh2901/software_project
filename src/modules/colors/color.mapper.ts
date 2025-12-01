import { Color } from './entity/color.entity';
import { ColorResponseDto } from './dto/color.dto';

export class ColorMapper {
  static toColorResponseDto(color: Color): ColorResponseDto {
    return {
      id: color.id,
      name_color: color.name_color,
      hex_code: color.hex_code
    };
  }

  static toColorResponseDtoList(colors: Color[]): ColorResponseDto[] {
    return colors.map((c) => ColorMapper.toColorResponseDto(c));
  }
}

export default ColorMapper;
