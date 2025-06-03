import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '@app/common/types/auth';
import { GrpcClientWrapper } from '@app/common/grpc/grpc-client-wrapper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest) {
    return this.authService.register(registerRequest)
  }

  @Post('login')
  login(@Body() loginRequest: LoginRequest) {
    return this.authService.login(loginRequest)
  }
}
