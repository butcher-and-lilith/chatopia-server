import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: string) {
    if (query) {
      const channels = await this.prismaService.channel.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      return channels;
    } else {
      const channels = await this.prismaService.channel.findMany({});
      return channels;
    }
  }

  async findOne(id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        messages: {
          include: {
            user: true,
            channel: true,
          },
        },
      },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id: '${id}' does not exist`);
    }

    return channel;
  }

  async create(userId: string, data) {
    const newChannel = await this.prismaService.channel.create({
      data: {
        name: data.name,
        description: data.description,
        owner: { connect: { id: userId } },
        members: { connect: { id: userId } },
      },
      include: {
        owner: true,
        members: true,
        messages: {
          include: {
            user: true,
            channel: true,
          },
        },
      },
    });

    return newChannel;
  }

  async update(id: string, data) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id: "${id}" does not exist`);
    }

    // add validation for ownerId

    try {
      const updatedChannel = await this.prismaService.channel.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
      return updatedChannel;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `The "${error.meta.target}" is invalid or already taken`,
          );
        }
      }
      throw error;
    }
  }

  async join(channelId: string, userId: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException(
        `Channel with id: "${channelId}" does not exist`,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { joinedChannels: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id: "${userId}" does not exist`);
    }

    const isChannelAlreadyJoined = user.joinedChannels.some(
      (channel) => channel.id === channelId,
    );

    if (!isChannelAlreadyJoined) {
      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          joinedChannels: {
            connect: { id: channelId },
          },
        },
      });
    } else {
      throw new ConflictException(
        `Channel with id: "${channelId}" is already joined.`,
      );
    }

    return channel;
  }

  async sendMessage(channelId: string, userId: string, content: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException(
        `Channel with id: "${channelId}" does not exist`,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { joinedChannels: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id: "${userId}" does not exist`);
    }

    const isChannelAlreadyJoined = user.joinedChannels.some(
      (channel) => channel.id === channelId,
    );

    if (!isChannelAlreadyJoined) {
      throw new NotFoundException(
        "You don't have permission to send message on this channel",
      );
    }

    const message = await this.prismaService.message.create({
      data: {
        content: content,
        user: { connect: { id: userId } },
        channel: { connect: { id: channelId } },
      },
      include: {
        user: true,
        channel: true,
      },
    });

    return message;
  }
}
