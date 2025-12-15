import { Body, Controller, ForbiddenException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessToken } from '../decorators/access-token.decorator';
import { RefreshToken } from '../decorators/refresh-token.decorator';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { ConfigurationService } from '../configuration/configuration.service';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configurationService: ConfigurationService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@RefreshToken() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const configuration = await this.configurationService.getConfig();

    if (!configuration.registration) {
      throw new ForbiddenException('Registration is disabled');
    }

    return this.authService.register(dto, configuration);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@AccessToken() accessToken: string) {
    await this.authService.logout(accessToken);
    return { success: true };
  }
}
