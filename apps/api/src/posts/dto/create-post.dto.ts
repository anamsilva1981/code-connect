import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Design systems para times front-end' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({
    example:
      'Como organizar tokens, componentes e fluxos para acelerar entregas.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  summary: string;

  @ApiProperty({
    example:
      'Um design system vivo conecta produto, engenharia e design por meio de componentes reutilizaveis.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({ example: '/feed/img-1-desktop.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @ApiProperty({
    example: ['Front-end', 'React', 'Design System'],
    type: [String],
  })
  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  tags: string[];
}
