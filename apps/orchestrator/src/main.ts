import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    OrchestratorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
        queue: RabbitMQConfig.queues.orchestrator.name || 'orchestrator_queue',
        queueOptions: {
          durable: true,
        },
        persistent: true,
        noAck: false,
      },
    }
  );
  await app.listen();
}
bootstrap();
