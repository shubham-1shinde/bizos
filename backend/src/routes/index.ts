import { Router } from 'express';
import { authenticate, requireCompany } from '../middlewares/auth';

import * as authController from '../controllers/auth.controller';
import * as dashboardController from '../controllers/dashboard.controller';
import * as salesController from '../controllers/sales.controller';
import * as inventoryController from '../controllers/inventory.controller';
import * as financeController from '../controllers/finance.controller';
import * as gstController from '../controllers/gst.controller';
import * as customerController from '../controllers/customer.controller';
import * as employeeController from '../controllers/employee.controller';
import * as aiController from '../controllers/ai.controller';
import * as forecastController from '../controllers/forecasting.controller';
import * as simulatorController from '../controllers/simulator.controller';
import * as automationController from '../controllers/automation.controller';
import * as reportController from '../controllers/report.controller';
import * as integrationController from '../controllers/integration.controller';
import * as settingsController from '../controllers/settings.controller';

const router = Router();

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getCurrentUser);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/onboarding', authenticate, authController.completeOnboarding);

// Protected Company Routes
router.use(authenticate, requireCompany);

// Dashboard & Executive
router.get('/dashboard', dashboardController.getDashboardData);

// Sales
router.get('/sales', salesController.getSales);
router.post('/sales', salesController.createSale);
router.get('/sales/:id', salesController.getSaleById);
router.put('/sales/:id', salesController.updateSale);
router.delete('/sales/:id', salesController.deleteSale);

// Inventory
router.get('/products', inventoryController.getProducts);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);
router.get('/categories', inventoryController.getCategories);
router.post('/categories', inventoryController.createCategory);
router.get('/warehouses', inventoryController.getWarehouses);
router.get('/suppliers', inventoryController.getSuppliers);

// Customers
router.get('/customers', customerController.getCustomers);
router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

// Employees
router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeController.createEmployee);
router.put('/employees/:id', employeeController.updateEmployee);

// Finance
router.get('/finance', financeController.getFinanceSummary);
router.get('/finance/expenses', financeController.getExpenses);
router.post('/finance/expenses', financeController.createExpense);

// GST & Compliance
router.get('/gst', gstController.getGSTSummary);
router.get('/gst/records', gstController.getGSTRecords);

// AI Business Assistant
router.post('/ai/chat', aiController.handleAIChat);
router.get('/ai/conversations', aiController.getConversations);
router.get('/ai/conversations/:conversationId/messages', aiController.getMessagesByConversation);

// Forecasting & Simulator
router.get('/forecasts', forecastController.getForecasts);
router.post('/simulations', simulatorController.runSimulation);

// Automation
router.get('/automation', automationController.getWorkflows);
router.post('/automation', automationController.createWorkflow);
router.patch('/automation/:id/toggle', automationController.toggleWorkflow);

// Reports
router.get('/reports', reportController.getReports);
router.post('/reports/generate', reportController.generateReport);

// Integrations
router.get('/integrations', integrationController.getIntegrations);
router.post('/integrations/:integrationId/sync', integrationController.syncIntegration);
router.get('/integrations/sync-logs', integrationController.getSyncLogs);

// Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings/company', settingsController.updateCompanySettings);

export default router;
