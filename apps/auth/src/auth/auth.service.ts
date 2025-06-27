import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/common/types/auth';
import { CreateUserDto, GrpcAppException, JwtService, RabbitMQConfig, RabbitMQService, UserErrorCode, UserRole } from '@app/common';
import * as bcrypt from 'bcrypt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
@Injectable()
export class AuthService {
    constructor(
        @Inject('ORCHESTRATOR_CLIENT') private client: ClientProxy,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly rabbitMQService: RabbitMQService
    ) { }

    async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
        //check if user already exists
        const existingUser = await this.userService.findByQuery({ username: registerRequest.username });
        if (existingUser.users.length > 0) {
            throw GrpcAppException.alreadyExists('User already exists', UserErrorCode.USER_ALREADY_EXISTS)
        }
        let userDto: CreateUserDto;
        userDto = {
            username: registerRequest.username,
            password: registerRequest.password,
            age: registerRequest.age,
            socialMedia: registerRequest.socialMedia,
            role: UserRole.MEMBER
        };
        // Hash the password before saving by bcrypt
        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
        userDto.password = hashedPassword;
        const user = await this.userService.create(userDto);

        this.rabbitMQService.publish(RabbitMQConfig.routingKeys.userCreated, user);
        // this.client.emit(RabbitMQConfig.routingKeys.userCreated, user);
        const jwtPayload = {
            userId: user.id,
            username: user.username,
            role: user.role
        }
        const tokens = await this.jwtService.generatePairedTokens(jwtPayload)
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user.id,
            username: user.username,
            role: user.role
        }
    }

    async login(loginRequest: LoginRequest): Promise<AuthResponse> {
        // find user by userName
        const user = await this.userService.checkUserCredentials(loginRequest.username, loginRequest.password);
        const jwtPayload = {
            userId: user.id,
            username: user.username,
            role: user.role
        }
        const tokens = await this.jwtService.generatePairedTokens(jwtPayload)
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user.id,
            username: user.username,
            role: user.role
        }
    }
}

