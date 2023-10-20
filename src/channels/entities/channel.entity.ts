import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserChannelEntity } from 'src/users/entities/user-channel.entity';
import { MessageEntity } from './message.entity';

export class ChannelEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @Type(() => UserChannelEntity)
  owner: UserChannelEntity;

  @ApiProperty()
  @Type(() => UserChannelEntity)
  members: UserChannelEntity[];

  @ApiProperty()
  @Type(() => MessageEntity)
  messages: MessageEntity[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  ownerId: string;

  constructor(partial: Partial<ChannelEntity>) {
    Object.assign(this, partial);
  }
}

interface User {
  password: string;
}

type UserTest = Exclude<User, 'password'>;
