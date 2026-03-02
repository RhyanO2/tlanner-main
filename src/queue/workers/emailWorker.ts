import { Worker } from "bullmq";
import { queueConnection } from "../queue-connection";
import { sendLoginEmail, sendRegisterEmail } from "../../services/mailService";
import type { emailJobData, EmailJobName } from "../jobs/emailQueue";

export function startEmailWorker() {
  const worker = new Worker<emailJobData, void, EmailJobName>(
    'email',          // must match the queue name
    async (job) => {
      if (job.name === 'send-register-email') {
        await sendRegisterEmail(job.data.to, job.data.userName);
      } else if (job.name === 'send-login-email') {
        await sendLoginEmail(job.data.to, job.data.userName);
      }
    },
    { connection: queueConnection, concurrency: 5 }
  );
  worker.on('completed', (job) => console.log(`✅ email job ${job.id} done`));
  worker.on('failed', (job, err) => console.error(`❌ email job ${job?.id} failed`, err.message));

  return worker;
}