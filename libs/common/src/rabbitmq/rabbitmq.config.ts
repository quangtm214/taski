export const RabbitMQConfig = {
  exchanges: {
    events: {
      name: 'events',
      type: 'topic',
    },
    commands: {
      name: 'commands',
      type: 'direct',
    },
  },
  queues: {
    // Định nghĩa các queue cho từng service
    auth: {
      name: 'auth_queue',
      routingKey: 'auth.*',
    },
    tasks: {
      name: 'tasks_queue',
      routingKey: 'tasks.*',
    },
    notifications: {
      name: 'notifications_queue',
      routingKey: 'notifications.*',
    },
    orchestrator: {
      name: 'orchestrator_queue',
      routingKey: 'orchestrator.*',
    },
  },
  // Định nghĩa các event routing keys
  routingKeys: {
    userCreated: 'auth.user.created',
    userUpdated: 'auth.user.updated',
    taskCreated: 'tasks.task.created',
    taskCompleted: 'tasks.task.completed',
    sendNotification: 'notifications.send',
  }
};