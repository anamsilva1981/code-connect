import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/user.types';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsQueryDto } from './dto/posts-query.dto';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: true;
    tags: true;
    likes: true;
    comments: {
      include: {
        author: true;
      };
      orderBy: {
        createdAt: 'asc';
      };
    };
    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
  };
}>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    query: PostsQueryDto,
    currentUser?: PublicUser,
  ): Promise<PostResponseDto[]> {
    const search = query.search?.trim();
    const tag = query.tag?.trim();
    const where: Prisma.PostWhereInput = {};

    if (tag) {
      where.tags = {
        some: {
          name: {
            equals: tag,
            mode: 'insensitive',
          },
        },
      };
    }

    if (search) {
      const ids = await this.searchPostIds(search, tag);
      where.id = {
        in: ids,
      };
    }

    const posts = await this.prisma.post.findMany({
      where,
      include: this.getPostInclude(currentUser?.id, false),
      orderBy:
        query.sort === 'popular'
          ? [{ likes: { _count: 'desc' } }, { createdAt: 'desc' }]
          : [{ createdAt: 'desc' }],
    });

    return posts.map((post) => this.toPostResponse(post));
  }

  async findById(
    id: string,
    currentUser?: PublicUser,
  ): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: this.getPostInclude(currentUser?.id, true),
    });

    if (!post) {
      throw new NotFoundException('Post nao encontrado.');
    }

    return this.toPostResponse(post);
  }

  async create(
    dto: CreatePostDto,
    currentUser: PublicUser,
  ): Promise<PostResponseDto> {
    const tags = this.normalizeTags(dto.tags);
    const post = await this.prisma.post.create({
      data: {
        title: dto.title.trim(),
        summary: dto.summary.trim(),
        content: dto.content.trim(),
        thumbnailUrl: dto.thumbnailUrl?.trim() || null,
        searchText: this.buildSearchText({
          title: dto.title,
          summary: dto.summary,
          content: dto.content,
          tags,
        }),
        authorId: currentUser.id,
        tags: {
          create: tags.map((name) => ({ name })),
        },
      },
      include: this.getPostInclude(currentUser.id, true),
    });

    return this.toPostResponse(post);
  }

  async like(id: string, currentUser: PublicUser): Promise<PostResponseDto> {
    await this.ensurePostExists(id);

    await this.prisma.postLike.createMany({
      data: [
        {
          postId: id,
          userId: currentUser.id,
        },
      ],
      skipDuplicates: true,
    });

    return this.findById(id, currentUser);
  }

  async unlike(id: string, currentUser: PublicUser): Promise<PostResponseDto> {
    await this.ensurePostExists(id);

    await this.prisma.postLike.deleteMany({
      where: {
        postId: id,
        userId: currentUser.id,
      },
    });

    return this.findById(id, currentUser);
  }

  async comment(
    id: string,
    dto: CreateCommentDto,
    currentUser: PublicUser,
  ): Promise<PostResponseDto> {
    await this.ensurePostExists(id);

    await this.prisma.postComment.create({
      data: {
        postId: id,
        authorId: currentUser.id,
        content: dto.content.trim(),
      },
    });

    return this.findById(id, currentUser);
  }

  private async ensurePostExists(id: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post nao encontrado.');
    }
  }

  private async searchPostIds(search: string, tag?: string): Promise<string[]> {
    const tagClause = tag
      ? Prisma.sql`AND EXISTS (
          SELECT 1
          FROM "PostTag" tag
          WHERE tag."postId" = post.id
            AND LOWER(tag.name) = LOWER(${tag})
        )`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`
        SELECT post.id
        FROM "Post" post
        WHERE to_tsvector('portuguese', post."searchText") @@ plainto_tsquery('portuguese', ${search})
        ${tagClause}
      `,
    );

    return rows.map((row) => row.id);
  }

  private getPostInclude(userId: string | undefined, includeComments: boolean) {
    return {
      author: true,
      tags: true,
      likes: {
        where: userId
          ? {
              userId,
            }
          : {
              id: '__anonymous__',
            },
      },
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc' as const,
        },
        ...(includeComments ? {} : { take: 0 }),
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    };
  }

  private toPostResponse(post: PostWithRelations): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      tags: post.tags.map((tag) => tag.name),
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likedByMe: post.likes.length > 0,
      createdAt: post.createdAt.toISOString(),
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        author: {
          id: comment.author.id,
          name: comment.author.name,
          email: comment.author.email,
        },
      })),
    };
  }

  private normalizeTags(tags: string[]): string[] {
    return Array.from(
      new Set(
        tags
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
          .slice(0, 6),
      ),
    );
  }

  private buildSearchText(post: {
    title: string;
    summary: string;
    content: string;
    tags: string[];
  }): string {
    return [post.title, post.summary, post.content, ...post.tags].join(' ');
  }
}
