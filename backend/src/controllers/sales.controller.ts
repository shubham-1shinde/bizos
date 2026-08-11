import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Sale, Product, Customer, GSTRecord } from '../models';

export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    const { status, customerId, startDate, endDate } = req.query;

    const query: any = { companyId };
    if (status) query.paymentStatus = status;
    if (customerId) query.customerId = customerId;
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate as string);
      if (endDate) query.saleDate.$lte = new Date(endDate as string);
    }

    const sales = await Sale.find(query)
      .populate('customerId', 'name email segment')
      .populate('items.productId', 'name sku')
      .sort({ saleDate: -1 });

    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSaleById = async (req: AuthRequest, res: Response) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, companyId: req.companyId })
      .populate('customerId')
      .populate('items.productId');

    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSale = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, items, paymentStatus, paymentMethod, saleDate } = req.body;
    const companyId = req.companyId;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer ID and at least one item are required' });
    }

    let subtotal = 0;
    let taxAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, companyId });
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

      if (product.currentStock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.currentStock}` });
      }

      const itemTaxRate = item.taxRate || 18;
      const itemSubtotal = item.unitPrice * item.quantity;
      const itemTax = (itemSubtotal * itemTaxRate) / 100;
      const itemTotal = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      taxAmount += itemTax;

      processedItems.push({
        productId: product._id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: itemTaxRate,
        total: itemTotal,
      });

      // Deduct inventory
      product.currentStock -= item.quantity;
      await product.save();
    }

    const totalAmount = subtotal + taxAmount;
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const sale = await Sale.create({
      companyId,
      invoiceNumber,
      customerId,
      items: processedItems,
      subtotal,
      taxAmount,
      totalAmount,
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'Bank Transfer',
      saleDate: saleDate || new Date(),
      createdBy: req.user?._id,
    });

    // Update Customer Total Spent
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalSpent: totalAmount },
      lastPurchaseDate: new Date(),
    });

    // Create GST Record
    await GSTRecord.create({
      companyId,
      invoiceNumber,
      type: 'OUTWARD',
      taxableAmount: subtotal,
      cgst: taxAmount / 2,
      sgst: taxAmount / 2,
      totalGst: taxAmount,
      date: saleDate || new Date(),
    });

    res.status(201).json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSale = async (req: AuthRequest, res: Response) => {
  try {
    const sale = await Sale.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      req.body,
      { new: true }
    );
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSale = async (req: AuthRequest, res: Response) => {
  try {
    const sale = await Sale.findOneAndDelete({ _id: req.params.id, companyId: req.companyId });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ message: 'Sale deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
