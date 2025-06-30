import { RabbitMQConfig } from '@app/common';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationService } from 'apps/notification/src/notification/notification.service';

@Controller('notification')
export class NotificationController {

    constructor(
        private readonly notificationService: NotificationService
    ) { }


    @EventPattern(RabbitMQConfig.routingKeys.sendNotificationUserCreated)
    async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        console.log('RECEIVED EVENT: sendNotificationUserCreated', data);
        await this.notificationService.newUserCreated(data);
        channel.ack(originalMsg);
        return { status: 'ok' }
        // await this.workflowsService.startUserOnboardingWorkflow(data);
    }
}
