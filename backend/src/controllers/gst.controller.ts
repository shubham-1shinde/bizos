import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth';
import { GSTRecord, GSTReturn } from '../models';

export const getGSTSummary = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const outwardAgg = await GSTRecord.aggregate([
      { $match: { companyId: companyObjectId, type: 'OUTWARD' } },
      {
        $group: {
          _id: null,
          totalTaxable: { $sum: '$taxableAmount' },
          totalCgst: { $sum: '$cgst' },
          totalSgst: { $sum: '$sgst' },
          totalIgst: { $sum: '$igst' },
          totalGst: { $sum: '$totalGst' }
        }
      }
    ]);

    const inwardAgg = await GSTRecord.aggregate([
      { $match: { companyId: companyObjectId, type: 'INWARD' } },
      {
        $group: {
          _id: null,
          totalTaxable: { $sum: '$taxableAmount' },
          totalItc: { $sum: '$totalGst' }
        }
      }
    ]);

    const outward = outwardAgg[0] || { totalTaxable: 0, totalCgst: 0, totalSgst: 0, totalIgst: 0, totalGst: 0 };
    const inward = inwardAgg[0] || { totalTaxable: 0, totalItc: 0 };

    const netTaxPayable = Math.max(0, outward.totalGst - inward.totalItc);
    const returns = await GSTReturn.find({ companyId }).sort({ dueDate: 1 });
    const gstRecords = await GSTRecord.find({ companyId }).sort({ date: -1 }).limit(10);

    res.json({
      summary: {
        outputTax: outward.totalGst,
        inputTaxCredit: inward.totalItc,
        netTaxLiability: netTaxPayable,
        cgst: outward.totalCgst,
        sgst: outward.totalSgst,
        igst: outward.totalIgst,
        complianceScore: 96,
        penaltyRisk: 'LOW',
        nextDueDate: returns.find(r => r.status === 'Pending')?.dueDate || new Date(Date.now() + 10 * 24 * 3600 * 1000)
      },
      returns,
      recentRecords: gstRecords
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGSTRecords = async (req: AuthRequest, res: Response) => {
  try {
    const records = await GSTRecord.find({ companyId: req.companyId }).sort({ date: -1 });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
