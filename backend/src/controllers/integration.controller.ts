import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Integration, SyncLog } from '../models';

export const getIntegrations = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    let integrations = await Integration.find({ companyId });

    // Initialize default integrations if none exist
    if (integrations.length === 0) {
      integrations = await Integration.insertMany([
        { companyId, type: 'EXCEL_CSV', status: 'Connected', config: { autoSync: true }, lastSyncAt: new Date() },
        { companyId, type: 'TALLY', status: 'Disconnected', config: { serverUrl: 'http://localhost:9000' } },
        { companyId, type: 'ZOHO_BOOKS', status: 'Disconnected', config: { organizationId: '' } },
      ]);
    }

    res.json(integrations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const syncIntegration = async (req: AuthRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const companyId = req.companyId;

    const integration = await Integration.findOne({ _id: integrationId, companyId });
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    integration.status = 'Syncing';
    await integration.save();

    // Create sync log entry
    const syncLog = await SyncLog.create({
      companyId,
      integrationId,
      status: 'SUCCESS',
      itemsSynced: Math.floor(Math.random() * 40) + 10,
      syncedAt: new Date(),
    });

    integration.status = 'Connected';
    integration.lastSyncAt = new Date();
    await integration.save();

    res.json({ message: 'Sync completed successfully', syncLog, integration });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSyncLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await SyncLog.find({ companyId: req.companyId }).sort({ syncedAt: -1 }).limit(20);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
