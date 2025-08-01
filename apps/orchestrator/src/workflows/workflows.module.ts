import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@app/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { OrchestratorModule } from 'apps/orchestrator/src/orchestrator.module';

@Module({
    imports: [
        RabbitMQModule.register({ name: 'notifications' }),
    ],
    controllers: [WorkflowsController],
    providers: [WorkflowsService],
})
export class WorkflowsModule { }