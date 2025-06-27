import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class OrchestratorService {
  // @EventPattern('authUserCreated') // ĐÚNG
  // async handleUserCreated(@Payload() data: any) {
  //   console.log('RECEIVED EVENT: auth.user.created', data);
  // }
}
