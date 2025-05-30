import { Module } from '@nestjs/common';
import { SharedAuthModule } from '@app/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        SharedAuthModule,
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
