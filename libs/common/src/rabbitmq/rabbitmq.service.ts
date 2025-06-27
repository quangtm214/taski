import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQConfig } from './rabbitmq.config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
    constructor(private readonly client: ClientProxy) { }

    async onModuleInit() {
        try {
            await this.client.connect();

            // const channel = await (this.client as any).createChannel();
            // await channel.assertExchange('events', 'topic', { durable: true });
            // await channel.close();
        } catch (err) {
            console.error('Failed to connect to RabbitMQ', err);
        }
    }

    publish(pattern: string, data: any) {
        console.log(`[${new Date().toISOString()}] Publishing to RabbitMQ:`, pattern, data);
        console.log('Client type:', this.client.constructor.name);
        console.log('Client options:', this.client['options'] ?
            JSON.stringify({
                exchange: this.client['options'].exchange || 'default',
                queue: this.client['options'].queue || 'unknown',
                urls: this.client['options'].urls
            }, null, 2) : 'No options available');
        try {
            // Note: exchange should be configured when setting up the ClientProxy
            const result = this.client.emit(pattern, data);
            console.log(`[${new Date().toISOString()}] Published successfully`);
            return result;
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error publishing:`, error);
            throw error;
        }
    }

    async send(pattern: string, data: any) {
        return lastValueFrom(this.client.send(pattern, data));
    }
}