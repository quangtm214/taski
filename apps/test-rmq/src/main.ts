import { NestFactory } from '@nestjs/core';
import { TestRmqModule } from './test-rmq.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TestRmqModule);

  // Kết nối microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'test_queue',
      queueOptions: {
        durable: true,
      },
      exchange: 'test_exchange',
      exchangeType: 'direct',
      routingKey: 'notifications',
    },
  });

  // Khởi động microservice + HTTP
  await app.startAllMicroservices();
  await app.listen(3333);
  console.log('App is listening on port 3333');
}
bootstrap();
