import { Queue } from 'bullmq';
import { queueConnection } from '../queue-connection';

export type EmailJobName = 'send-register-email' | 'send-login-email';

export interface emailJobData {
  to: string;
  userName: string;
}

export const emailQueue = new Queue<emailJobData, void, EmailJobName>('email', {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: ' exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});
