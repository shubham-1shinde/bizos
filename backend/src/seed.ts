import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import {
  User,
  Company,
  CompanyUser,
  Category,
  Product,
  Customer,
  Supplier,
  Employee,
  Warehouse,
  Inventory,
  Sale,
  Purchase,
  Expense,
  GSTRecord,
  GSTReturn,
  Notification,
  Integration,
  AutomationWorkflow,
  Forecast,
} from './models';

const seedDatabase = async () => {
  await connectDB();
  console.log('[Seed]: Clearing existing database collections...');

  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    CompanyUser.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Supplier.deleteMany({}),
    Employee.deleteMany({}),
    Warehouse.deleteMany({}),
    Inventory.deleteMany({}),
    Sale.deleteMany({}),
    Purchase.deleteMany({}),
    Expense.deleteMany({}),
    GSTRecord.deleteMany({}),
    GSTReturn.deleteMany({}),
    Notification.deleteMany({}),
    Integration.deleteMany({}),
    AutomationWorkflow.deleteMany({}),
    Forecast.deleteMany({}),
  ]);

  console.log('[Seed]: Creating Demo Company...');
  const company = await Company.create({
    name: 'Apex Innovations Pvt Ltd',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    gstNumber: '27AAACA0000A1Z5',
    address: 'Suite 402, Tech Park, Bandra East, Mumbai - 400051',
    financialYear: '2025-2026',
    industry: 'Technology & Hardware Solutions',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    onboardingCompleted: true,
  });

  const companyId = company._id as mongoose.Types.ObjectId;

  console.log('[Seed]: Creating Users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    { name: 'Vikram Sharma', email: 'owner@apex.com', passwordHash, role: 'Owner', currentCompanyId: companyId },
    { name: 'Anita Roy', email: 'admin@apex.com', passwordHash, role: 'Admin', currentCompanyId: companyId },
    { name: 'Rahul Mehta', email: 'manager@apex.com', passwordHash, role: 'Manager', currentCompanyId: companyId },
    { name: 'Priya Patel', email: 'priya@apex.com', passwordHash, role: 'Employee', currentCompanyId: companyId },
    { name: 'Sanjay Kumar', email: 'sanjay@apex.com', passwordHash, role: 'Employee', currentCompanyId: companyId },
  ]);

  for (const u of users) {
    await CompanyUser.create({
      companyId,
      userId: u._id,
      role: u.role,
    });
  }

  console.log('[Seed]: Creating Categories & Suppliers...');
  const categories = await Category.insertMany([
    { companyId, name: 'Laptops & Workstations', description: 'Enterprise computing hardware' },
    { companyId, name: 'Peripherals & Accessories', description: 'Monitors, keyboards, audio gear' },
    { companyId, name: 'Networking & Servers', description: 'Routers, switches, rack servers' },
    { companyId, name: 'Office Furniture', description: 'Ergonomic chairs and desks' },
  ]);

  const suppliers = await Supplier.insertMany([
    { companyId, name: 'Global Tech Supplies India', contactPerson: 'Ramesh Shah', email: 'sales@globaltech.in', phone: '+91 9820011223', rating: 4.8 },
    { companyId, name: 'Silicon Core Distributors', contactPerson: 'Neha Gupta', email: 'orders@siliconcore.com', phone: '+91 9811144556', rating: 4.5 },
  ]);

  console.log('[Seed]: Creating Warehouses & Products (20 SKUs)...');
  const warehouses = await Warehouse.insertMany([
    { companyId, name: 'Central Mumbai Fulfillment Hub', location: 'Bhiwandi', capacity: 15000, currentUtilization: 62 },
    { companyId, name: 'Bengaluru Logistics Facility', location: 'Peenya', capacity: 10000, currentUtilization: 40 },
  ]);

  const rawProducts = [
    { name: 'ApexPro UltraBook M16', sku: 'APX-NB-001', cat: categories[0]._id, unitPrice: 85000, costPrice: 62000, stock: 25, reorder: 10 },
    { name: 'Apex WorkStation Tower X', sku: 'APX-DT-002', cat: categories[0]._id, unitPrice: 125000, costPrice: 92000, stock: 12, reorder: 5 },
    { name: 'UltraSlim 27-inch 4K Monitor', sku: 'APX-MN-003', cat: categories[1]._id, unitPrice: 32000, costPrice: 22000, stock: 45, reorder: 15 },
    { name: 'Ergonomic Mechanical Keyboard', sku: 'APX-KB-004', cat: categories[1]._id, unitPrice: 4500, costPrice: 2600, stock: 8, reorder: 15 }, // Low stock trigger!
    { name: 'Wireless Precision Mouse', sku: 'APX-MS-005', cat: categories[1]._id, unitPrice: 2200, costPrice: 1100, stock: 90, reorder: 20 },
    { name: 'Enterprise Core Router 10G', sku: 'APX-NW-006', cat: categories[2]._id, unitPrice: 68000, costPrice: 48000, stock: 6, reorder: 5 },
    { name: 'Manageable 48-Port Switch', sku: 'APX-NW-007', cat: categories[2]._id, unitPrice: 42000, costPrice: 30000, stock: 14, reorder: 8 },
    { name: 'Rack Server Dual Xeon 2U', sku: 'APX-SV-008', cat: categories[2]._id, unitPrice: 240000, costPrice: 175000, stock: 4, reorder: 2 },
    { name: 'ProMesh Executive Office Chair', sku: 'APX-FN-009', cat: categories[3]._id, unitPrice: 18500, costPrice: 11500, stock: 30, reorder: 10 },
    { name: 'Motorized Height Adjustable Desk', sku: 'APX-FN-010', cat: categories[3]._id, unitPrice: 34000, costPrice: 21000, stock: 18, reorder: 5 },
    { name: 'Thunderbolt 4 Quad Docking Station', sku: 'APX-AC-011', cat: categories[1]._id, unitPrice: 14500, costPrice: 9000, stock: 50, reorder: 12 },
    { name: 'Noise-Canceling Wireless Headset', sku: 'APX-AU-012', cat: categories[1]._id, unitPrice: 12000, costPrice: 7200, stock: 4, reorder: 10 }, // Low stock trigger!
    { name: '2TB NVMe PCIe 4.0 SSD', sku: 'APX-HD-013', cat: categories[1]._id, unitPrice: 16000, costPrice: 11000, stock: 60, reorder: 15 },
    { name: 'Smart UPS 3000VA Rack Mount', sku: 'APX-PW-014', cat: categories[2]._id, unitPrice: 54000, costPrice: 38000, stock: 10, reorder: 4 },
    { name: 'Dual Monitor Desk Arm Heavy Duty', sku: 'APX-FN-015', cat: categories[3]._id, unitPrice: 7500, costPrice: 4200, stock: 35, reorder: 10 },
    { name: 'Thermal Receipt Printer Bluetooth', sku: 'APX-POS-016', cat: categories[1]._id, unitPrice: 8500, costPrice: 5200, stock: 22, reorder: 8 },
    { name: 'Omnidirectional Conference Speaker', sku: 'APX-AU-017', cat: categories[1]._id, unitPrice: 19500, costPrice: 12800, stock: 15, reorder: 5 },
    { name: 'Wi-Fi 7 Mesh Access Point Enterprise', sku: 'APX-NW-018', cat: categories[2]._id, unitPrice: 28000, costPrice: 18500, stock: 20, reorder: 6 },
    { name: 'Acoustic Soundproofing Wall Panel', sku: 'APX-FN-019', cat: categories[3]._id, unitPrice: 3200, costPrice: 1600, stock: 120, reorder: 30 },
    { name: 'Portable 15.6-inch OLED Monitor', sku: 'APX-MN-020', cat: categories[1]._id, unitPrice: 24500, costPrice: 16000, stock: 16, reorder: 5 },
  ];

  const products = [];
  for (const p of rawProducts) {
    const created = await Product.create({
      companyId,
      name: p.name,
      sku: p.sku,
      categoryId: p.cat,
      supplierId: suppliers[0]._id,
      unitPrice: p.unitPrice,
      costPrice: p.costPrice,
      currentStock: p.stock,
      reorderPoint: p.reorder,
      status: 'active',
    });
    products.push(created);

    await Inventory.create({
      companyId,
      productId: created._id,
      warehouseId: warehouses[0]._id,
      quantity: p.stock,
      reorderLevel: p.reorder,
    });
  }

  console.log('[Seed]: Creating Customers (10)...');
  const customers = await Customer.insertMany([
    { companyId, name: 'Reliance Retail Labs', email: 'procurement@relianceretail.com', phone: '+91 9821098210', segment: 'VIP', totalSpent: 1450000, creditLimit: 500000 },
    { companyId, name: 'Tata Digital Services', email: 'tech@tatadigital.com', phone: '+91 9833012345', segment: 'VIP', totalSpent: 980000, creditLimit: 400000 },
    { companyId, name: 'Infosys FinTech Operations', email: 'infra@infosys.com', phone: '+91 9844054321', segment: 'Premium', totalSpent: 620000, creditLimit: 250000 },
    { companyId, name: 'Zomato Engineering HQ', email: 'hardware@zomato.com', phone: '+91 9877065432', segment: 'Premium', totalSpent: 450000, creditLimit: 200000 },
    { companyId, name: 'Swiggy Logistics Network', email: 'ops@swiggy.in', phone: '+91 9899011223', segment: 'Regular', totalSpent: 280000, creditLimit: 100000 },
    { companyId, name: 'Razorpay Payment Tech', email: 'office@razorpay.com', phone: '+91 9900033445', segment: 'Regular', totalSpent: 190000, creditLimit: 100000 },
    { companyId, name: 'Freshworks Enterprise Solution', email: 'it@freshworks.com', phone: '+91 9911155667', segment: 'New', totalSpent: 85000, creditLimit: 50000 },
    { companyId, name: 'PhonePe Infrastructure Team', email: 'devices@phonepe.com', phone: '+91 9922277889', segment: 'At Risk', totalSpent: 340000, creditLimit: 150000 },
    { companyId, name: 'Paytm Corporate Fleet', email: 'fleet@paytm.com', phone: '+91 9933399001', segment: 'Inactive', totalSpent: 120000, creditLimit: 50000 },
    { companyId, name: 'Unacademy Learning Hub', email: 'admin@unacademy.com', phone: '+91 9944411223', segment: 'Regular', totalSpent: 210000, creditLimit: 100000 },
  ]);

  console.log('[Seed]: Creating Employees (10)...');
  const employees = await Employee.insertMany([
    { companyId, name: 'Aarav Sharma', email: 'aarav@apex.com', role: 'Senior Sales Director', department: 'Enterprise Sales', salary: 120000, targetSales: 1500000, achievedSales: 1850000, attendanceRate: 98, productivityScore: 94 },
    { companyId, name: 'Diya Verma', email: 'diya@apex.com', role: 'Key Account Executive', department: 'Enterprise Sales', salary: 85000, targetSales: 1000000, achievedSales: 1120000, attendanceRate: 96, productivityScore: 91 },
    { companyId, name: 'Kabir Das', email: 'kabir@apex.com', role: 'Regional Sales Manager', department: 'West Region', salary: 95000, targetSales: 1200000, achievedSales: 1050000, attendanceRate: 94, productivityScore: 86 },
    { companyId, name: 'Ananya Iyer', email: 'ananya@apex.com', role: 'Customer Success Manager', department: 'Support', salary: 75000, targetSales: 500000, achievedSales: 540000, attendanceRate: 97, productivityScore: 89 },
    { companyId, name: 'Rohan Deshmukh', email: 'rohan@apex.com', role: 'Inventory Controller', department: 'Logistics', salary: 65000, targetSales: 0, achievedSales: 0, attendanceRate: 95, productivityScore: 88 },
    { companyId, name: 'Sneha Kapoor', email: 'sneha@apex.com', role: 'Financial Analyst', department: 'Finance', salary: 80000, targetSales: 0, achievedSales: 0, attendanceRate: 99, productivityScore: 96 },
    { companyId, name: 'Arjun Nair', email: 'arjun@apex.com', role: 'Inside Sales Specialist', department: 'SMB Sales', salary: 60000, targetSales: 600000, achievedSales: 680000, attendanceRate: 92, productivityScore: 84 },
    { companyId, name: 'Meera Sen', email: 'meera@apex.com', role: 'Compliance Officer', department: 'Legal & GST', salary: 85000, targetSales: 0, achievedSales: 0, attendanceRate: 98, productivityScore: 92 },
    { companyId, name: 'Karan Singhania', email: 'karan@apex.com', role: 'Procurement Specialist', department: 'Supply Chain', salary: 70000, targetSales: 0, achievedSales: 0, attendanceRate: 95, productivityScore: 87 },
    { companyId, name: 'Tanvi Joshi', email: 'tanvi@apex.com', role: 'Business Ops Analyst', department: 'Operations', salary: 72000, targetSales: 0, achievedSales: 0, attendanceRate: 96, productivityScore: 90 },
  ]);

  console.log('[Seed]: Creating Sales & GST Records...');
  for (let i = 1; i <= 15; i++) {
    const prod = products[i % products.length];
    const cust = customers[i % customers.length];
    const qty = (i % 3) + 1;
    const subtotal = prod.unitPrice * qty;
    const taxAmount = (subtotal * 18) / 100;
    const totalAmount = subtotal + taxAmount;
    const invNo = `INV-2026-${1000 + i}`;

    const saleDate = new Date(Date.now() - (15 - i) * 2 * 24 * 3600 * 1000);

    await Sale.create({
      companyId,
      invoiceNumber: invNo,
      customerId: cust._id,
      items: [{ productId: prod._id, quantity: qty, unitPrice: prod.unitPrice, taxRate: 18, total: totalAmount }],
      subtotal,
      taxAmount,
      totalAmount,
      paymentStatus: i % 4 === 0 ? 'Pending' : 'Paid',
      paymentMethod: i % 2 === 0 ? 'Bank Transfer' : 'UPI',
      saleDate,
      createdBy: users[0]._id,
    });

    await GSTRecord.create({
      companyId,
      invoiceNumber: invNo,
      type: 'OUTWARD',
      taxableAmount: subtotal,
      cgst: taxAmount / 2,
      sgst: taxAmount / 2,
      igst: 0,
      totalGst: taxAmount,
      date: saleDate,
    });
  }

  console.log('[Seed]: Creating Expenses & GST Returns...');
  const expenseCategories = ['Rent', 'Utilities', 'Payroll', 'Marketing', 'Software Licensing'];
  for (let i = 1; i <= 8; i++) {
    await Expense.create({
      companyId,
      category: expenseCategories[i % expenseCategories.length],
      amount: 15000 + i * 8500,
      description: `Monthly corporate expense #${i}`,
      date: new Date(Date.now() - i * 5 * 24 * 3600 * 1000),
      paymentMethod: 'Bank Transfer',
    });
  }

  await GSTReturn.insertMany([
    { companyId, returnType: 'GSTR1', period: '2026-Q1', status: 'Filed', dueDate: new Date('2026-04-11'), filingDate: new Date('2026-04-09'), taxLiability: 185000, itcAvailable: 42000 },
    { companyId, returnType: 'GSTR3B', period: '2026-03', status: 'Pending', dueDate: new Date(Date.now() + 6 * 24 * 3600 * 1000), taxLiability: 142000, itcAvailable: 38000 },
  ]);

  console.log('[Seed]: Creating Notifications & Workflows...');
  await Notification.insertMany([
    { companyId, title: 'Low Stock Alert', message: 'Ergonomic Mechanical Keyboard (APX-KB-004) stock is 8 (reorder at 15)', type: 'LOW_STOCK' },
    { companyId, title: 'GST Filing Due', message: 'GSTR-3B return filing due in 6 days.', type: 'GST_REMINDER' },
    { companyId, title: 'AI Insights Ready', message: 'Quarterly predictive sales report generated.', type: 'FORECAST_ALERT' },
  ]);

  await AutomationWorkflow.create({
    companyId,
    name: 'Auto Restock & Manager Alert',
    trigger: 'STOCK_LESS_THAN_REORDER',
    conditions: { minStock: 10 },
    actions: ['NOTIFY_MANAGER', 'CREATE_PURCHASE_ORDER', 'SEND_EMAIL'],
    isEnabled: true,
  });

  await Integration.insertMany([
    { companyId, type: 'EXCEL_CSV', status: 'Connected', config: { autoSync: true }, lastSyncAt: new Date() },
    { companyId, type: 'TALLY', status: 'Disconnected', config: { serverUrl: 'http://localhost:9000' } },
    { companyId, type: 'ZOHO_BOOKS', status: 'Disconnected', config: { organizationId: '' } },
  ]);

  console.log('----------------------------------------------------');
  console.log('✅ SEED COMPLETED SUCCESSFULLY!');
  console.log('Demo Owner Account: owner@apex.com | Password: password123');
  console.log('Company: Apex Innovations Pvt Ltd');
  console.log('----------------------------------------------------');
  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
