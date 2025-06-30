import { Controller, Get } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitMQConfig } from '@app/common';

@Controller()
export class OrchestratorController {
  constructor() { }

  // @EventPattern(RabbitMQConfig.routingKeys.userCreated)
  // async handleUserCreated(@Payload() data: any) {
  //   console.log('RECEIVED EVENT: auth.user.created', data);
  //   return { status: 'ok' }
  //   // await this.workflowsService.startUserOnboardingWorkflow(data);
  // }
}
