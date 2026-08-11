export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Employee';
  currentCompanyId?: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  gstNumber?: string;
  address?: string;
  financialYear: string;
  industry: string;
  currency: string;
  timezone: string;
  onboardingCompleted: boolean;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reorderPoint: number;
  demandScore?: number;
  prediction?: string;
  restockDate?: string;
  categoryId?: { _id: string; name: string };
  supplierId?: { _id: string; name: string };
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  segment: 'VIP' | 'Premium' | 'Regular' | 'New' | 'At Risk' | 'Inactive';
  totalSpent: number;
  lastPurchaseDate?: string;
  creditLimit: number;
  aiPredictions?: {
    nextPurchaseDate: string;
    clvEstimated: number;
    churnRisk: string;
    satisfactionScore: number;
  };
}

export interface Employee {
  _id: string;
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

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customerId: { _id: string; name: string; email?: string };
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  paymentMethod: string;
  saleDate: string;
  items: Array<{
    productId: { name: string; sku: string };
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface Expense {
  _id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
}

export interface GSTSummary {
  outputTax: number;
  inputTaxCredit: number;
  netTaxLiability: number;
  cgst: number;
  sgst: number;
  igst: number;
  complianceScore: number;
  penaltyRisk: string;
  nextDueDate: string;
}

export interface DashboardData {
  kpis: {
    revenue: number;
    expenses: number;
    profit: number;
    orders: number;
    pendingPayments: number;
    gstLiability: number;
    totalProducts: number;
    totalCustomers: number;
    totalEmployees: number;
    customerGrowthRate: number;
    cashFlowNet: number;
  };
  charts: {
    revenueTrend: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
  };
  lowStockProducts: Array<{ name: string; currentStock: number; reorderPoint: number; sku: string }>;
  recentSales: Sale[];
  topProducts: Product[];
  topEmployees: Employee[];
  aiInsights: Array<{ id: string; title: string; description: string; priority: string }>;
}
