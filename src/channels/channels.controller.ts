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
  ApiQuery,
} from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search channels by name',
  })
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async findAll(@Query('q') query?: string) {
    const channels = await this.channelsService.findAll(query);
    return channels.map((channel) => new ChannelEntity(channel));
  }

  @Get(':id')
  @ApiOkResponse({ type: ChannelEntity })
  async findOne(@Param('id') id: string) {
    return new ChannelEntity(await this.channelsService.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ChannelEntity })
  async create(@Request() req, @Body() createChannelDto: CreateChannelDto) {
    const userId = req.user.id;
    return new ChannelEntity(
      await this.channelsService.create(userId, createChannelDto),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ChannelEntity })
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return new ChannelEntity(
      await this.channelsService.update(id, updateChannelDto),
    );
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ChannelEntity })
  async join(@Param('id') channelId: string, @Request() req) {
    const userId = req.user.id;
    return new ChannelEntity(
      await this.channelsService.join(channelId, userId),
    );
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ChannelEntity })
  async findAllMessages(@Param('id') channelId: string, @Request() req) {
    const userId = req.user.id;
    // return await this.channelsService.sendMessage(
    //   channelId,
    //   userId,
    //   sendMessageDto.content,
    // );

    // get all messages (rmv messages in get channel)
  }

  @Post(':id/messages/send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ChannelEntity })
  async sendMessage(
    @Param('id') channelId: string,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const userId = req.user.id;
    return await this.channelsService.sendMessage(
      channelId,
      userId,
      sendMessageDto.content,
    );
  }
}
