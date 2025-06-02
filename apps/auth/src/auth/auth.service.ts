import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/common/types/auth';
import { CreateUserDto, JwtService, UserRole } from '@app/common';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
        //check if user already exists
        const existingUser = await this.userService.findByQuery({ username: registerRequest.username });
        if (existingUser.users.length > 0) {
            throw new RpcException(
                {
                    code: status.ALREADY_EXISTS,
                    message: `User with username ${registerRequest.username} already exists`
                }
            )
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

