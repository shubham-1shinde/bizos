import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { initCronJobs } from './jobs/cronJobs';

const startServer = async () => {
  await connectDB();
  initCronJobs();

  app.listen(env.PORT, () => {
    console.log(`[BizOS Backend Server running on port ${env.PORT}]`);
  });
};

startServer();
