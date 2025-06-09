import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@app/common';

@Injectable()
export class WorkflowsService {
    constructor(private readonly rabbitMQService: RabbitMQService) { }

    async startUserOnboardingWorkflow(userData: any) {
        // 1. Gửi email chào mừng
        await this.rabbitMQService.publish('notifications.send', {
            type: 'email',
            recipient: userData.email,
            template: 'welcome',
            data: userData,
        });

        // 2. Tạo task mặc định cho user mới
        await this.rabbitMQService.publish('tasks.task.create', {
            title: 'Complete your profile',
            description: 'Please complete your profile to get started',
            userId: userData.id,
            priority: 'high',
        });

        return { success: true, message: 'User onboarding workflow started' };
    }

    async startTaskWorkflow(taskData: any) {
        // 1. Thông báo cho user về task mới
        await this.rabbitMQService.publish('notifications.send', {
            type: 'notification',
            recipient: taskData.userId,
            title: 'New Task',
            message: `You have a new task: ${taskData.title}`,
        });

        return { success: true, message: 'Task workflow started' };
    }

    async startWorkflow(type: string, payload: any) {
        switch (type) {
            case 'user-onboarding':
                return this.startUserOnboardingWorkflow(payload);
            case 'task-management':
                return this.startTaskWorkflow(payload);
            default:
                throw new Error(`Unknown workflow type: ${type}`);
        }
    }
}