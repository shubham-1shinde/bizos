import cron from 'node-cron';
import { Product, Notification, GSTReturn } from '../models';

export const initCronJobs = () => {
  console.log('[Cron Jobs]: Initializing scheduled background tasks...');

  // 1. Daily Low Stock & Reorder Checks (Every Midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Job]: Checking low stock items...');
    try {
      const lowStockProducts = await Product.find({
        $expr: { $lte: ['$currentStock', '$reorderPoint'] },
      });

      for (const product of lowStockProducts) {
        await Notification.create({
          companyId: product.companyId,
          title: `Low Stock Alert: ${product.name}`,
          message: `Current stock (${product.currentStock}) has fallen below reorder point (${product.reorderPoint}).`,
          type: 'LOW_STOCK',
        });
      }
    } catch (err) {
      console.error('[Cron Job Error - Low Stock]:', err);
    }
  });

  // 2. Weekly GST Reminder Notifications (Every Monday 9 AM)
  cron.schedule('0 9 * * 1', async () => {
    console.log('[Cron Job]: Checking upcoming GST return deadlines...');
    try {
      const pendingReturns = await GSTReturn.find({ status: 'Pending' });
      for (const gstReturn of pendingReturns) {
        await Notification.create({
          companyId: gstReturn.companyId,
          title: `GST Return Reminder: ${gstReturn.returnType}`,
          message: `Your ${gstReturn.returnType} for period ${gstReturn.period} is due on ${gstReturn.dueDate.toISOString().split('T')[0]}.`,
          type: 'GST_REMINDER',
        });
      }
    } catch (err) {
      console.error('[Cron Job Error - GST Reminder]:', err);
    }
  });
};
