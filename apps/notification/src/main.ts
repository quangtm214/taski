import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '@app/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
        queue: RabbitMQConfig.queues.notifications.name,
        exchange: RabbitMQConfig.exchanges.events.name,
        exchangeType: RabbitMQConfig.exchanges.events.type || 'topic',
        queueOptions: {
          durable: true,
        },
        noAck: false,
        queueBindings: [
          {
            exchange: RabbitMQConfig.exchanges.events.name,
            routingKey: RabbitMQConfig.routingKeys.sendNotificationUserCreated,
          }
        ],
        persistent: true,
      },
    },
  );
  await app.startAllMicroservices();
  console.log('Notification Service is running');
}
bootstrap();
