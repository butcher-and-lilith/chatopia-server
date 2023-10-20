import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserChannelEntity {
  @ApiProperty()
  id: string;

  @Exclude()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  avatarUrl: string;

  @Exclude()
  status: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  createdChannelId: string;

  constructor(partial: Partial<UserChannelEntity>) {
    Object.assign(this, partial);
  }
}
