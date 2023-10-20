import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserChannelEntity } from 'src/users/entities/user-channel.entity';

export class MessageEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @Type(() => UserChannelEntity)
  user: UserChannelEntity;

  @ApiProperty()
  timestamp: Date;

  @Exclude()
  channel: Object;

  @Exclude()
  userId: string;

  @Exclude()
  channelId: string;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
