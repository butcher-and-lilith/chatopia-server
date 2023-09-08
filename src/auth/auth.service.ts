import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const hashedPassword: string = bcrypt.hashSync(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND),
    );

    try {
      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `The "${error.meta.target} is invalid or already taken`,
          );
        }
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
