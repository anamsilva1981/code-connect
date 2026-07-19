import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
  @ApiProperty({ example: '8d9d03c2-5cbb-450a-9f35-f79d5a63f147' })
  id: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @ApiProperty({ example: 'ada@codeconnect.dev' })
  email: string;
}
