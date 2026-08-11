import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Company, User } from '../models';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const company = await Company.findById(req.companyId);

    res.json({
      profile: user,
      company,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCompanySettings = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.companyId, req.body, { new: true });
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
