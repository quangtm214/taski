import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@app/common';
import { NotificationModule } from 'apps/notification/src/notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'apps/notification/src/notification/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'notification_user',
      password: 'notification_password',
      database: 'notification',
      entities: [NotificationEntity],
      synchronize: true,
    }),
    NotificationModule
  ],
})
export class AppModule { }
