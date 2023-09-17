import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ default: 'user@email.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'username' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'John' })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Snow' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'My user status' })
  status: string;
}
