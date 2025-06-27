import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '@app/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
        queue: RabbitMQConfig.queues.notifications.name,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );
  await app.listen();
}
bootstrap();
