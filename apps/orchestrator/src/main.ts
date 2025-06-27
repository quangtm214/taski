import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '@app/common';
import * as amqplib from 'amqplib';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Orchestrator');
  logger.log('Starting Orchestrator Service...');

  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672');
  const channel = await connection.createChannel();

  // Đảm bảo exchange tồn tại
  await channel.assertExchange('events', 'topic', { durable: true });

  // Tạo queue trước khi binding
  await channel.assertQueue('orchestrator_queue', { durable: true });

  try {
    await channel.unbindQueue('orchestrator_queue', 'events', 'auth.user.created');
  } catch (err) {
    // Ignore errors if binding didn't exist
  }

  // Tạo binding
  await channel.bindQueue(
    'orchestrator_queue',
    'events',
    'auth.user.created'
  );
  logger.log('Created binding: orchestrator_queue -> events with routing key: auth.user.created');
  await channel.close();
  await connection.close();
  const app = await NestFactory.create(OrchestratorModule);
  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
        queue: 'orchestrator_queue',
        exchange: RabbitMQConfig.exchanges.events.name,
        exchangeType: RabbitMQConfig.exchanges.events.type || 'topic',
        noAck: false,
        queueOptions: {
          durable: true,
        },
        queueBindings: [
          {
            exchange: RabbitMQConfig.exchanges.events.name,
            routingKey: RabbitMQConfig.routingKeys.userCreated,
          },
          {
            exchange: RabbitMQConfig.exchanges.events.name,
            routingKey: RabbitMQConfig.routingKeys.taskCreated, // 'tasks.task.created'
          },
        ],
        persistent: true,

      },
    }
  );
  await app.startAllMicroservices();
  console.log('Orchestrator service is running');
}
bootstrap();
