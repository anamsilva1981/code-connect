import { ApiProperty } from '@nestjs/swagger';
import { PublicUserDto } from './public-user.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature',
  })
  accessToken: string;

  @ApiProperty({ type: PublicUserDto })
  user: PublicUserDto;
}
