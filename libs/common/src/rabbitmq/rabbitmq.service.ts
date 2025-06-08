import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQConfig } from './rabbitmq.config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
    constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) { }

    async onModuleInit() {
        try {
            await this.client.connect();
        } catch (err) {
            console.error('Failed to connect to RabbitMQ', err);
        }
    }

    async publish(pattern: string, data: any) {
        return lastValueFrom(this.client.emit(pattern, data));
    }

    async send(pattern: string, data: any) {
        return lastValueFrom(this.client.send(pattern, data));
    }
}