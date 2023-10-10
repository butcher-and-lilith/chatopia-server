import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Send your message' })
  content: string;
}
