import mongoose, { Schema, Document } from 'mongoose';

// ----------------------------------------------------
// 1. User
// ----------------------------------------------------
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Employee';
  currentCompanyId?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Owner', 'Admin', 'Manager', 'Employee'], default: 'Owner' },
  currentCompanyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// ----------------------------------------------------
// 2. Company
// ----------------------------------------------------
export interface ICompany extends Document {
  name: string;
  logo?: string;
  gstNumber?: string;
  address?: string;
  financialYear: string;
  industry: string;
  currency: string;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  financialYear: { type: String, default: '2025-2026' },
  industry: { type: String, default: 'Retail' },
  currency: { type: String, default: 'INR' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  onboardingCompleted: { type: Boolean, default: false },
}, { timestamps: true });

// ----------------------------------------------------
// 3. Role & Permission
// ----------------------------------------------------
const PermissionSchema = new Schema({
  name: { type: String, required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
});
const RoleSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  permissions: [PermissionSchema],
}, { timestamps: true });

// ----------------------------------------------------
// 4. CompanyUser
// ----------------------------------------------------
const CompanyUserSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['Owner', 'Admin', 'Manager', 'Employee'], required: true },
  status: { type: String, enum: ['active', 'invited', 'suspended'], default: 'active' },
}, { timestamps: true });

// ----------------------------------------------------
// 5. Category & Product
// ----------------------------------------------------
const CategorySchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export interface IProduct extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  description?: string;
  categoryId?: mongoose.Types.ObjectId;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reorderPoint: number;
  supplierId?: mongoose.Types.ObjectId;
  status: 'active' | 'discontinued';
}
const ProductSchema = new Schema<IProduct>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  description: { type: String, default: '' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  unitPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, required: true, min: 0 },
  currentStock: { type: Number, required: true, default: 0 },
  reorderPoint: { type: Number, required: true, default: 10 },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  status: { type: String, enum: ['active', 'discontinued'], default: 'active' },
}, { timestamps: true });
ProductSchema.index({ companyId: 1, sku: 1 }, { unique: true });

// ----------------------------------------------------
// 6. Customer
// ----------------------------------------------------
export interface ICustomer extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  segment: 'VIP' | 'Premium' | 'Regular' | 'New' | 'At Risk' | 'Inactive';
  totalSpent: number;
  lastPurchaseDate?: Date;
  creditLimit: number;
  status: 'active' | 'inactive';
}
const CustomerSchema = new Schema<ICustomer>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  segment: { type: String, enum: ['VIP', 'Premium', 'Regular', 'New', 'At Risk', 'Inactive'], default: 'Regular' },
  totalSpent: { type: Number, default: 0 },
  lastPurchaseDate: { type: Date },
  creditLimit: { type: Number, default: 50000 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// ----------------------------------------------------
// 7. Supplier
// ----------------------------------------------------
const SupplierSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
}, { timestamps: true });

// ----------------------------------------------------
// 8. Employee
// ----------------------------------------------------
export interface IEmployee extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  targetSales: number;
  achievedSales: number;
  attendanceRate: number;
  productivityScore: number;
}
const EmployeeSchema = new Schema<IEmployee>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'Sales Executive' },
  department: { type: String, default: 'Sales' },
  salary: { type: Number, required: true },
  targetSales: { type: Number, default: 100000 },
  achievedSales: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 95 },
  productivityScore: { type: Number, default: 85 },
}, { timestamps: true });

// ----------------------------------------------------
// 9. Warehouse & Inventory
// ----------------------------------------------------
const WarehouseSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  location: { type: String, default: '' },
  capacity: { type: Number, default: 10000 },
  currentUtilization: { type: Number, default: 45 },
}, { timestamps: true });

const InventorySchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 15 },
}, { timestamps: true });

const InventoryTransactionSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT', 'RETURN'], required: true },
  quantity: { type: Number, required: true },
  referenceId: { type: String, default: '' },
  notes: { type: String, default: '' },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ----------------------------------------------------
// 10. Sale & SaleItem
// ----------------------------------------------------
const SaleItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 18 },
  total: { type: Number, required: true },
});

export interface ISale extends Document {
  companyId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  customerId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  paymentMethod: string;
  saleDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

const SaleSchema = new Schema<ISale>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  invoiceNumber: { type: String, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [SaleItemSchema],
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Partially Paid'], default: 'Paid' },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  saleDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
SaleSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

// ----------------------------------------------------
// 11. Purchase & PurchaseItem
// ----------------------------------------------------
const PurchaseItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  total: { type: Number, required: true },
});

const PurchaseSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  poNumber: { type: String, required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [PurchaseItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Ordered', 'Received', 'Pending', 'Cancelled'], default: 'Received' },
  purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

// ----------------------------------------------------
// 12. Expense & Payment
// ----------------------------------------------------
const ExpenseSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  category: { type: String, required: true }, // e.g. Rent, Utilities, Payroll, Marketing
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  receiptUrl: { type: String, default: '' },
}, { timestamps: true });

const PaymentSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  referenceType: { type: String, enum: ['Sale', 'Purchase', 'Expense'], required: true },
  referenceId: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
}, { timestamps: true });

// ----------------------------------------------------
// 13. GSTRecord & GSTReturn
// ----------------------------------------------------
const GSTRecordSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  invoiceNumber: { type: String, required: true },
  type: { type: String, enum: ['OUTWARD', 'INWARD'], required: true },
  taxableAmount: { type: Number, required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalGst: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const GSTReturnSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  returnType: { type: String, enum: ['GSTR1', 'GSTR3B'], required: true },
  period: { type: String, required: true }, // e.g. "2026-Q1" or "2026-03"
  status: { type: String, enum: ['Filed', 'Pending', 'Draft', 'Overdue'], default: 'Pending' },
  dueDate: { type: Date, required: true },
  filingDate: { type: Date },
  taxLiability: { type: Number, default: 0 },
  itcAvailable: { type: Number, default: 0 },
}, { timestamps: true });

// ----------------------------------------------------
// 14. Forecast & Simulation
// ----------------------------------------------------
const ForecastSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  type: { type: String, enum: ['REVENUE', 'SALES', 'DEMAND', 'PROFIT', 'INVENTORY', 'EXPENSES'], required: true },
  period: { type: String, default: 'Next 30 Days' },
  predictions: Schema.Types.Mixed,
  metrics: Schema.Types.Mixed,
  confidence: { type: Number, default: 92 },
}, { timestamps: true });

const SimulationSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  scenarioType: { type: String, required: true },
  parameters: Schema.Types.Mixed,
  results: Schema.Types.Mixed,
  recommendation: { type: String },
}, { timestamps: true });

// ----------------------------------------------------
// 15. AIConversation & AIMessage
// ----------------------------------------------------
const AIConversationSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Business Chat' },
}, { timestamps: true });

const AIMessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true, index: true },
  sender: { type: String, enum: ['USER', 'ASSISTANT'], required: true },
  text: { type: String, required: true },
  dataContext: Schema.Types.Mixed,
}, { timestamps: true });

// ----------------------------------------------------
// 16. Notification, Integration, SyncLog, Report, Automation, AuditLog
// ----------------------------------------------------
const NotificationSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['LOW_STOCK', 'GST_REMINDER', 'PAYMENT_ALERT', 'FORECAST_ALERT', 'AUTOMATION'], default: 'LOW_STOCK' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const IntegrationSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  type: { type: String, enum: ['EXCEL_CSV', 'TALLY', 'ZOHO_BOOKS'], required: true },
  status: { type: String, enum: ['Connected', 'Disconnected', 'Syncing'], default: 'Disconnected' },
  config: Schema.Types.Mixed,
  lastSyncAt: { type: Date },
}, { timestamps: true });

const SyncLogSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  integrationId: { type: Schema.Types.ObjectId, ref: 'Integration', required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'IN_PROGRESS'], required: true },
  itemsSynced: { type: Number, default: 0 },
  errors: [String],
  syncedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ReportSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Sales', 'Inventory', 'Finance', 'GST', 'Customers', 'Employees', 'Executive'], required: true },
  format: { type: String, enum: ['PDF', 'Excel', 'CSV'], default: 'PDF' },
  schedule: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Manual'], default: 'Manual' },
  parameters: Schema.Types.Mixed,
  fileUrl: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const AutomationWorkflowSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  trigger: { type: String, required: true }, // e.g. "STOCK_LESS_THAN"
  conditions: Schema.Types.Mixed,
  actions: [String], // e.g. ["NOTIFY_MANAGER", "CREATE_PURCHASE_ORDER", "SEND_EMAIL"]
  isEnabled: { type: Boolean, default: true },
  lastExecutedAt: { type: Date },
}, { timestamps: true });

const AuditLogSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  module: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
}, { timestamps: true });

// Export Models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Company = mongoose.model<ICompany>('Company', CompanySchema);
export const Role = mongoose.model('Role', RoleSchema);
export const Permission = mongoose.model('Permission', PermissionSchema);
export const CompanyUser = mongoose.model('CompanyUser', CompanyUserSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Product = mongoose.model<IProduct>('Product', ProductSchema);
export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Supplier = mongoose.model('Supplier', SupplierSchema);
export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const Warehouse = mongoose.model('Warehouse', WarehouseSchema);
export const Inventory = mongoose.model('Inventory', InventorySchema);
export const InventoryTransaction = mongoose.model('InventoryTransaction', InventoryTransactionSchema);
export const Sale = mongoose.model<ISale>('Sale', SaleSchema);
export const Purchase = mongoose.model('Purchase', PurchaseSchema);
export const Expense = mongoose.model('Expense', ExpenseSchema);
export const Payment = mongoose.model('Payment', PaymentSchema);
export const GSTRecord = mongoose.model('GSTRecord', GSTRecordSchema);
export const GSTReturn = mongoose.model('GSTReturn', GSTReturnSchema);
export const Forecast = mongoose.model('Forecast', ForecastSchema);
export const Simulation = mongoose.model('Simulation', SimulationSchema);
export const AIConversation = mongoose.model('AIConversation', AIConversationSchema);
export const AIMessage = mongoose.model('AIMessage', AIMessageSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
export const Integration = mongoose.model('Integration', IntegrationSchema);
export const SyncLog = mongoose.model('SyncLog', SyncLogSchema);
export const Report = mongoose.model('Report', ReportSchema);
export const AutomationWorkflow = mongoose.model('AutomationWorkflow', AutomationWorkflowSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
