import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Name of your channel' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Description of your channel' })
  description: string;
}
