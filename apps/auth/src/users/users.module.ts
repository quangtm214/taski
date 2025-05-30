import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialMediaEntity, UserEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SocialMediaEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
