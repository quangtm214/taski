import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { WorkflowsService } from './workflows.service';
import { RabbitMQConfig } from '@app/common';

@Controller()
export class WorkflowsController {
    constructor(
        private readonly workflowsService: WorkflowsService
    ) { }

    @EventPattern(RabbitMQConfig.routingKeys.userCreated)
    async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        console.log('RECEIVED EVENT: auth.user.created', data);
        await this.workflowsService.startUserOnboardingWorkflow(data);
        channel.ack(originalMsg);

        return { status: 'ok' }
    }

    // @EventPattern('tasks.task.created')
    // async handleTaskCreated(@Payload() data: any) {
    //     console.log('Task created event received', data);
    //     await this.workflowsService.startTaskWorkflow(data);
    // }

    // @MessagePattern('orchestrator.start_workflow')
    // async startWorkflow(@Payload() data: { type: string; payload: any }) {
    //     console.log(`Starting workflow ${data.type}`, data.payload);
    //     return this.workflowsService.startWorkflow(data.type, data.payload);
    // }
}