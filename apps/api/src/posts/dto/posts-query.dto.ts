import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tag?: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular'] })
  @IsOptional()
  @IsIn(['recent', 'popular'])
  sort?: 'recent' | 'popular';
}
