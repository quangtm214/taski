import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { HttpExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
