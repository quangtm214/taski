import { Module } from '@nestjs/common';
import { TestRmqController } from './test-rmq.controller';
import { TestRmqService } from './test-rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'test_queue',
          queueOptions: {
            durable: true
          },
          exchange: 'test_exchange',
          exchangeType: 'direct',
          routingKey: 'notifications',
        },
      },
    ]),
  ],
  controllers: [TestRmqController],
  providers: [TestRmqService],
})
export class TestRmqModule { }
