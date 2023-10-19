import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ChannelEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  owner: User;

  @ApiProperty()
  members: User[];

  @ApiProperty()
  messages: Message[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ChannelEntity>) {
    Object.assign(this, partial);
  }
}

interface User {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface Message {
  user: User;
  content: string;
  timestamp: Date;
}
