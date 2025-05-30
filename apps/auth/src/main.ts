import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@app/common/types/user';
import { AUTH_PACKAGE_NAME } from '@app/common/types/auth';

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
  await app.listen();
}
bootstrap();
