import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '@app/common';

@Module({
    imports: [
        RabbitMQModule.register({ name: 'notifications' }),
    ],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule { }
