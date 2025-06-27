import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TestRmqService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) { }

  sendTestMessage() {
    return this.client.emit('notifications', {
      message: 'Hello from producer',
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
