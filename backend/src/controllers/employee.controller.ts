import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Employee } from '../models';

export const getEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const employees = await Employee.find({ companyId: req.companyId }).sort({ achievedSales: -1 });
    
    const aiInsight = "Employee sales achievement average is 108% of quarterly targets. Productivity increased by 7.4% overall.";

    res.json({
      employees,
      aiInsight,
      leaderboard: employees.slice(0, 5),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      companyId: req.companyId,
    });
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      req.body,
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
