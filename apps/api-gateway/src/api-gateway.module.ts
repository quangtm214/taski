import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UserModule } from './user/user.module';
import { join } from 'path';

const protoPath = process.env.NODE_ENV === 'production'
  ? join(__dirname, '/app/proto')
  : join(__dirname, '../../proto');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user-service',
          protoPath: join(__dirname, '../../proto/user-service.proto'),
          url: 'localhost:50051', // Địa chỉ User Service
        },
      },
    ]),
    UserModule
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
