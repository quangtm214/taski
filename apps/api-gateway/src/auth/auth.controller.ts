import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '@app/common/types/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest) {
    return this.authService.register(registerRequest)
  }

  @Post('login')
  login(@Body() loginRequest: LoginRequest) {
    return this.authService.login(loginRequest)
  }
}
