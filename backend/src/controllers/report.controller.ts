import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Report } from '../models';

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find({ companyId: req.companyId }).sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, format, schedule } = req.body;
    const report = await Report.create({
      companyId: req.companyId,
      name: name || `${type} Report - ${new Date().toISOString().split('T')[0]}`,
      type: type || 'Sales',
      format: format || 'PDF',
      schedule: schedule || 'Manual',
      fileUrl: `/reports/export_${Date.now()}.${(format || 'pdf').toLowerCase()}`,
      generatedAt: new Date(),
    });
    res.status(201).json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
