import { Controller, Get } from '@nestjs/common';
import { TestRmqService } from './test-rmq.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class TestRmqController {
  constructor(private readonly testRmqService: TestRmqService) { }


  @EventPattern('notifications')
  getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Received:', data);
    console.log('Pattern:', context.getPattern());
  }

  @Get('/send')
  send(): any {
    return this.testRmqService.sendTestMessage();
  }

  @Get()
  getHello(): string {
    return this.testRmqService.getHello();
  }

}
