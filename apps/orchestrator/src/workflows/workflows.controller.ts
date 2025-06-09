import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { WorkflowsService } from './workflows.service';

@Controller()
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) { }

    @EventPattern('auth.user.created')
    async handleUserCreated(@Payload() data: any) {
        console.log('User created event received', data);
        await this.workflowsService.startUserOnboardingWorkflow(data);
    }

    @EventPattern('tasks.task.created')
    async handleTaskCreated(@Payload() data: any) {
        console.log('Task created event received', data);
        await this.workflowsService.startTaskWorkflow(data);
    }

    @MessagePattern('orchestrator.start_workflow')
    async startWorkflow(@Payload() data: { type: string; payload: any }) {
        console.log(`Starting workflow ${data.type}`, data.payload);
        return this.workflowsService.startWorkflow(data.type, data.payload);
    }
}