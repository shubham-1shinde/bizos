import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sale, Product, Customer } from '../types';
import { Modal } from '../components/Modal';
import { Plus, ShoppingBag, Search, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // New Sale Form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const [salesRes, prodRes, custRes] = await Promise.all([
        api.get('/sales'),
        api.get('/products'),
        api.get('/customers'),
      ]);
      setSales(salesRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct) return;

    const prod = products.find((p) => p._id === selectedProduct);
    if (!prod) return;

    try {
      await api.post('/sales', {
        customerId: selectedCustomer,
        items: [
          {
            productId: selectedProduct,
            quantity: Number(quantity),
            unitPrice: prod.unitPrice,
            taxRate: 18,
          },
        ],
        paymentStatus,
      });

      setIsModalOpen(false);
      fetchSalesData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create sale');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Sales Management <ShoppingBag className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-xs text-slate-400">Manage invoices, payment statuses, and tax breakdown</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Create New Sale Invoice
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice or customer..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Taxable (₹)</th>
                <th className="px-6 py-3.5">GST 18% (₹)</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{sale.invoiceNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-200">{sale.customerId?.name || 'Customer'}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">₹{sale.subtotal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">₹{sale.taxAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sale.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/sales/${sale._id}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sale Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Sale Invoice">
        <form onSubmit={handleCreateSale} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Customer</label>
            <select
              required
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.segment})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Product</label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} - ₹{p.unitPrice.toLocaleString()} (Stock: {p.currentStock})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e: any) => setPaymentStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Generate Sale Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
