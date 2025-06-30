import { Module } from '@nestjs/common';
import { RabbitMQModule, SharedAuthModule } from '@app/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        SharedAuthModule,
        UsersModule,
        RabbitMQModule.register({ name: 'orchestrator' }),
        // ClientsModule.register([
        //     {
        //         name: 'ORCHESTRATOR_CLIENT',
        //         transport: Transport.RMQ,
        //         options: {
        //             urls: ['amqp://user:password@localhost:5672'],
        //             queue: 'orchestrator_queue',
        //             queueOptions: {
        //                 durable: true
        //             },
        //             exchange: 'events',
        //             exchangeType: 'topic',
        //             // routingKey: 'auth.user.*',
        //         },
        //     },
        // ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
