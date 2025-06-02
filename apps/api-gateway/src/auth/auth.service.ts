import { AUTH_SERVICE_NAME, AuthServiceClient, LoginRequest, RegisterRequest } from '@app/common/types/auth';
import { status } from '@grpc/grpc-js';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'apps/api-gateway/src/auth/constant';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    private authService: AuthServiceClient

    constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(
            AUTH_SERVICE_NAME
        );
    }

    async register(request: RegisterRequest) {
        try {
            const result = await lastValueFrom(this.authService.register(request));
            return result;
        } catch (error) {
            if (error.code === status.ALREADY_EXISTS) {
                throw new BadRequestException(error.details)
            }
            throw new InternalServerErrorException('An unexpected error occurred during registration.')
        }
    }

    async login(request: LoginRequest) {
        try {
            const result = await lastValueFrom(this.authService.login(request));
            return result;
        } catch (error) {
            if (error.code === status.NOT_FOUND) {
                throw new NotFoundException(error.details);
            }
            if (error.code === status.UNAUTHENTICATED) {
                throw new BadRequestException(error.details);
            }
            throw new InternalServerErrorException('An unexpected error occurred during login.');
        }

    }
}
