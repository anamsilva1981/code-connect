import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Muito bom esse conteudo!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
