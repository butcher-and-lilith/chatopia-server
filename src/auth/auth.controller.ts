import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto) {
    return await this.authService.register(
      registerDto.email,
      registerDto.username,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
    );
  }

  @Post('/login')
  async login(@Body() loginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
