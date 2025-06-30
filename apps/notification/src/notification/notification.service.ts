import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'apps/notification/src/notification/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notiRepository: Repository<NotificationEntity>,
    ) { }

    async newUserCreated(userData: any) {
        // 1. Lưu thông báo vào database
        const notification = this.notiRepository.create({
            userId: userData.id,
            message: `Welcome ${userData.username}, your account has been created successfully!`,
        });

        await this.notiRepository.save(notification);

        // 2. Trả về thông báo đã lưu
        return notification;
    }
}
