import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@app/common/types/user';
import { AUTH_PACKAGE_NAME } from '@app/common/types/auth';
import { GrpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, '../auth.proto'),
          join(__dirname, '../user.proto'),
        ],
        package: [
          USER_PACKAGE_NAME,
          AUTH_PACKAGE_NAME
        ],
      }
    }
  )
  // app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
}
bootstrap();
