import { Module } from '@nestjs/common';
import { UsersModule } from 'apps/api-gateway/src/users/users.module';

@Module({
  imports: [
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule { }
