import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Name of your channel' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Description of your channel' })
  description: string;
}
