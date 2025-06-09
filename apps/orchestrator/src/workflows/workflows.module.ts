import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@app/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
    imports: [RabbitMQModule.register({ name: 'orchestrator' })],
    controllers: [WorkflowsController],
    providers: [WorkflowsService],
})
export class WorkflowsModule { }