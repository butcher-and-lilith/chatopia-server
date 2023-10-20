import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserPrivateEntity } from './entities/user-private.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search users by name',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(@Query('q') query?: string) {
    const users = await this.usersService.findAll(query);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserPrivateEntity })
  async findOne(@Param('id') id: string) {
    return new UserPrivateEntity(await this.usersService.findOne(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserPrivateEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserPrivateEntity(
      await this.usersService.update(id, updateUserDto),
    );
  }
}
