import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Product, Category, Warehouse, Supplier, Inventory, InventoryTransaction } from '../models';

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ companyId: req.companyId })
      .populate('categoryId', 'name')
      .populate('supplierId', 'name contactPerson')
      .sort({ createdAt: -1 });

    // Map demand metrics and AI prediction values
    const enrichedProducts = products.map((p) => {
      const isLow = p.currentStock <= p.reorderPoint;
      return {
        ...p.toObject(),
        demandScore: isLow ? 88 : 45,
        prediction: isLow ? 'High Risk of Stockout' : 'Optimal Stock',
        restockDate: isLow ? new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0] : 'N/A',
      };
    });

    res.json(enrichedProducts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create({
      ...req.body,
      companyId: req.companyId,
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, companyId: req.companyId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({ companyId: req.companyId });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.create({ ...req.body, companyId: req.companyId });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarehouses = async (req: AuthRequest, res: Response) => {
  try {
    const warehouses = await Warehouse.find({ companyId: req.companyId });
    res.json(warehouses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSuppliers = async (req: AuthRequest, res: Response) => {
  try {
    const suppliers = await Supplier.find({ companyId: req.companyId });
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
