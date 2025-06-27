import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@app/common/types/user';
import { AUTH_PACKAGE_NAME } from '@app/common/types/auth';
import { RabbitMQConfig } from '@app/common';
import * as amqplib from 'amqplib';

async function bootstrap() {

  // const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672');
  // const channel = await connection.createChannel();

  // // Đảm bảo exchange tồn tại
  // await channel.assertExchange('events', 'topic', { durable: true });

  // // Tạo queue trước khi binding
  // await channel.assertQueue('auth_queue', { durable: true });

  // // Tạo binding
  // await channel.bindQueue(
  //   'auth_queue',
  //   'events'
  // );

  // await channel.close();
  // await connection.close();


  // Hybrid application - cả gRPC và RabbitMQ
  const app = await NestFactory.create(AppModule);

  // Cấu hình gRPC
  app.connectMicroservice<MicroserviceOptions>({
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
  });

  // Cấu hình RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
      queue: RabbitMQConfig.queues.auth.name,
      queueOptions: {
        durable: true,
      },
      // noAck: false,
      // persistent: true,
      // exchange: RabbitMQConfig.exchanges.events.name,
      // exchangeType: RabbitMQConfig.exchanges.events.type || 'topic',
    },
  });

  // Khởi động cả hai microservice
  await app.startAllMicroservices();
  console.log('Auth service is running');
}
bootstrap();