import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from './rabbitmq.config';
import { RabbitMQService } from './rabbitmq.service';

@Module({})
export class RabbitMQModule {
    static register(options: { name: string }): DynamicModule {
        return {
            module: RabbitMQModule,
            imports: [
                ClientsModule.register([
                    {
                        name: options.name,
                        transport: Transport.RMQ,
                        options: {
                            urls: [process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672'],
                            queue: RabbitMQConfig.queues[options.name]?.name || `${options.name}_queue`,
                            queueOptions: {
                                durable: true,
                            },
                            persistent: true,
                            noAck: false,
                        },
                    },
                ]),
            ],
            providers: [RabbitMQService],
            exports: [ClientsModule, RabbitMQService],
        };
    }
}