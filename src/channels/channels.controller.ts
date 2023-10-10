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
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';
//import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Send } from 'express';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  @ApiOkResponse({ isArray: true })
  async findAll(@Query('q') query?: string) {
    const channels = await this.channelsService.findAll(query);
    return channels;
  }

  @Get(':id')
  @ApiOkResponse({})
  async findOne(@Param('id') id: string) {
    return await this.channelsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({})
  async create(
    @Param('id') id: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return await this.channelsService.create(id, createChannelDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({})
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return await this.channelsService.update(id, updateChannelDto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({})
  async join(@Param('id') channelId: string, @Request() req) {
    const userId = req.user.id;
    return await this.channelsService.join(channelId, userId);
  }

  @Post(':id/chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({})
  async chat(
    @Param('id') channelId: string,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const userId = req.user.id;
    return await this.channelsService.chat(
      channelId,
      userId,
      sendMessageDto.content,
    );
  }
}
