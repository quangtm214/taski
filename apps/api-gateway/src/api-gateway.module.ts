import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SharedAuthModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SharedAuthModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule { }
