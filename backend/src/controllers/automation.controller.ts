import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AutomationWorkflow } from '../models';

export const getWorkflows = async (req: AuthRequest, res: Response) => {
  try {
    const workflows = await AutomationWorkflow.find({ companyId: req.companyId }).sort({ createdAt: -1 });
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const workflow = await AutomationWorkflow.create({
      ...req.body,
      companyId: req.companyId,
    });
    res.status(201).json(workflow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const workflow = await AutomationWorkflow.findOne({ _id: req.params.id, companyId: req.companyId });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    workflow.isEnabled = !workflow.isEnabled;
    await workflow.save();
    res.json(workflow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
