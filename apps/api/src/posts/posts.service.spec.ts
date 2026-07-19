import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/user.types';

type PostRecord = {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnailUrl: string | null;
  author: PublicUser;
  tags: Array<{ name: string }>;
  likes: Array<{ id: string }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: PublicUser;
  }>;
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: Date;
};

type PostFindManyArgs = {
  where?: {
    id?: {
      in: string[];
    };
  };
};

type PostCreateArgs = {
  data: {
    title: string;
    summary: string;
    content: string;
    authorId: string;
    searchText: string;
    tags: {
      create: Array<{ name: string }>;
    };
  };
};

describe('PostsService', () => {
  let service: PostsService;
  let prisma: {
    $queryRaw: jest.Mock<Promise<Array<{ id: string }>>, [unknown]>;
    post: {
      create: jest.Mock<Promise<PostRecord>, [PostCreateArgs]>;
      findMany: jest.Mock<Promise<PostRecord[]>, [PostFindManyArgs]>;
      findUnique: jest.Mock<
        Promise<PostRecord | { id: string } | null>,
        [unknown]
      >;
    };
    postComment: {
      create: jest.Mock<Promise<unknown>, [unknown]>;
    };
    postLike: {
      createMany: jest.Mock<Promise<unknown>, [unknown]>;
      deleteMany: jest.Mock<Promise<unknown>, [unknown]>;
    };
  };

  const currentUser: PublicUser = {
    id: 'user-id',
    name: 'Ada Lovelace',
    email: 'ada@codeconnect.dev',
  };

  const post: PostRecord = {
    id: 'post-id',
    title: 'Full-text search no PostgreSQL',
    summary: 'Busca textual no backend.',
    content: 'Conteudo do post.',
    thumbnailUrl: null,
    author: currentUser,
    tags: [{ name: 'PostgreSQL' }, { name: 'Back-end' }],
    likes: [{ id: 'like-id' }],
    comments: [
      {
        id: 'comment-id',
        content: 'Muito bom.',
        createdAt: new Date('2026-07-19T10:00:00.000Z'),
        author: currentUser,
      },
    ],
    _count: {
      likes: 1,
      comments: 1,
    },
    createdAt: new Date('2026-07-19T09:00:00.000Z'),
  };

  beforeEach(() => {
    prisma = {
      $queryRaw: jest.fn<Promise<Array<{ id: string }>>, [unknown]>(),
      post: {
        create: jest.fn<Promise<PostRecord>, [PostCreateArgs]>(),
        findMany: jest.fn<Promise<PostRecord[]>, [PostFindManyArgs]>(),
        findUnique: jest.fn<
          Promise<PostRecord | { id: string } | null>,
          [unknown]
        >(),
      },
      postComment: {
        create: jest.fn<Promise<unknown>, [unknown]>(),
      },
      postLike: {
        createMany: jest.fn<Promise<unknown>, [unknown]>(),
        deleteMany: jest.fn<Promise<unknown>, [unknown]>(),
      },
    };
    service = new PostsService(prisma as unknown as PrismaService);
  });

  it('lists posts with full-text search ids and likedByMe', async () => {
    prisma.$queryRaw.mockResolvedValue([{ id: 'post-id' }]);
    prisma.post.findMany.mockResolvedValue([post]);

    const posts = await service.list(
      { search: 'postgres', tag: 'Back-end', sort: 'popular' },
      currentUser,
    );

    expect(prisma.$queryRaw).toHaveBeenCalled();
    const findManyArgs = prisma.post.findMany.mock.calls[0][0];

    expect(findManyArgs.where?.id).toEqual({
      in: ['post-id'],
    });
    expect(posts[0]).toMatchObject({
      id: 'post-id',
      likedByMe: true,
      likesCount: 1,
      commentsCount: 1,
      tags: ['PostgreSQL', 'Back-end'],
    });
  });

  it('creates posts with normalized tags and search text', async () => {
    prisma.post.create.mockResolvedValue(post);

    await service.create(
      {
        title: ' Novo post ',
        summary: ' Resumo ',
        content: ' Conteudo ',
        tags: ['React', 'React', ' Front-end '],
      },
      currentUser,
    );

    const createArgs = prisma.post.create.mock.calls[0][0];

    expect(createArgs.data).toMatchObject({
      title: 'Novo post',
      summary: 'Resumo',
      content: 'Conteudo',
      authorId: 'user-id',
      tags: {
        create: [{ name: 'React' }, { name: 'Front-end' }],
      },
    });
    expect(createArgs.data.searchText).toContain('Front-end');
  });

  it('likes a post idempotently', async () => {
    prisma.post.findUnique
      .mockResolvedValueOnce({ id: 'post-id' })
      .mockResolvedValueOnce(post);
    prisma.postLike.createMany.mockResolvedValue({ count: 1 });

    await service.like('post-id', currentUser);

    expect(prisma.postLike.createMany).toHaveBeenCalledWith({
      data: [
        {
          postId: 'post-id',
          userId: 'user-id',
        },
      ],
      skipDuplicates: true,
    });
  });

  it('rejects comments for missing posts', async () => {
    prisma.post.findUnique.mockResolvedValue(null);

    await expect(
      service.comment('missing-post', { content: 'Oi' }, currentUser),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
