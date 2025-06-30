import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'apps/notification/src/notification/entities/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity]),
        RabbitMQModule.register({ name: 'orchestrator' }),
    ],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule { }
