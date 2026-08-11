import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth';
import { Expense, Payment, Sale } from '../models';

export const getFinanceSummary = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Sales Revenue
    const salesAgg = await Sale.aggregate([
      { $match: { companyId: companyObjectId } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, taxCollected: { $sum: '$taxAmount' } } }
    ]);
    const totalRevenue = salesAgg[0]?.totalRevenue || 0;
    const taxCollected = salesAgg[0]?.taxCollected || 0;

    // Expenses
    const expensesAgg = await Expense.aggregate([
      { $match: { companyId: companyObjectId } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } }
    ]);
    const totalExpenses = expensesAgg[0]?.totalExpenses || 0;

    // Expenses by Category
    const categoryAgg = await Expense.aggregate([
      { $match: { companyId: companyObjectId } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } }
    ]);

    const grossProfit = totalRevenue - (totalRevenue * 0.55); // estimated Cost of Goods Sold
    const netProfit = totalRevenue - totalExpenses;
    const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
    const netMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        grossProfit,
        netProfit,
        grossMargin: Number(grossMargin),
        netMargin: Number(netMargin),
        taxCollected,
        cashBalance: netProfit * 0.85,
      },
      expensesByCategory: categoryAgg,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.find({ companyId: req.companyId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      companyId: req.companyId,
    });
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
