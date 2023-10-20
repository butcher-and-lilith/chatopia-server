import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserPrivateEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  status: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  createdChannelId: string;

  constructor(partial: Partial<UserPrivateEntity>) {
    Object.assign(this, partial);
  }
}
