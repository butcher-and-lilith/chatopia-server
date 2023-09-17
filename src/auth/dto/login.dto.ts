import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'user@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'password' })
  password: string;
}
