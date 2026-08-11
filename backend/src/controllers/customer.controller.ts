import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Customer } from '../models';

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await Customer.find({ companyId: req.companyId }).sort({ totalSpent: -1 });

    const enrichedCustomers = customers.map((c) => ({
      ...c.toObject(),
      aiPredictions: {
        nextPurchaseDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        clvEstimated: c.totalSpent * 2.4 + 25000,
        churnRisk: c.segment === 'At Risk' ? 'HIGH' : c.segment === 'VIP' ? 'LOW' : 'MEDIUM',
        satisfactionScore: 92,
      }
    }));

    res.json(enrichedCustomers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      companyId: req.companyId,
    });
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      req.body,
      { new: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, companyId: req.companyId });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
