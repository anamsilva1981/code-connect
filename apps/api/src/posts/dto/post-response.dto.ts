import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class PostCommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;
}

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  thumbnailUrl: string | null;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  likedByMe: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: [PostCommentDto] })
  comments: PostCommentDto[];
}
