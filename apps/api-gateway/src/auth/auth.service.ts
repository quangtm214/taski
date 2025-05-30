import { AUTH_SERVICE_NAME, AuthServiceClient, LoginRequest, RegisterRequest } from '@app/common/types/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'apps/api-gateway/src/auth/constant';

@Injectable()
export class AuthService implements OnModuleInit {
    private authService: AuthServiceClient

    constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(
            AUTH_SERVICE_NAME
        );
    }

    register(request: RegisterRequest) {
        return this.authService.register(request)
    }

    login(request: LoginRequest) {
        return this.authService.login(request)
    }
}
