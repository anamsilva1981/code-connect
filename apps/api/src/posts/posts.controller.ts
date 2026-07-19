import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: [PostResponseDto] })
  list(
    @Query() query: PostsQueryDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto[]> {
    return this.postsService.list(query, request.user);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: PostResponseDto })
  findById(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    return this.postsService.findById(id, request.user);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    return this.postsService.create(createPostDto, request.user);
  }

  @Post(':id/likes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  like(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    return this.postsService.like(id, request.user);
  }

  @Delete(':id/likes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  unlike(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    return this.postsService.unlike(id, request.user);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  comment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    return this.postsService.comment(id, createCommentDto, request.user);
  }
}
