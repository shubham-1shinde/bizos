import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Sale } from '../types';
import { ArrowLeft, Printer, Download, CheckCircle, FileText } from 'lucide-react';

export const SaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaleDetail();
  }, [id]);

  const fetchSaleDetail = async () => {
    try {
      const res = await api.get(`/sales/${id}`);
      setSale(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sale) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/sales')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sales Ledger
        </button>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700/80 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Tax Invoice
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="flex items-start justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              TAX INVOICE <FileText className="w-5 h-5 text-blue-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">Invoice #: <span className="font-bold text-white">{sale.invoiceNumber}</span></p>
            <p className="text-xs text-slate-400">Date: {new Date(sale.saleDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {sale.paymentStatus}
            </span>
            <p className="text-xs text-slate-400 mt-2">Payment Method: {sale.paymentMethod}</p>
          </div>
        </div>

        {/* Customer & Company Details */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px]">Billed To:</span>
            <p className="font-bold text-white text-sm mt-1">{sale.customerId?.name || 'Walk-in Customer'}</p>
            <p className="text-slate-400">{sale.customerId?.email}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Seller Details:</span>
            <p className="font-bold text-white text-sm mt-1">Apex Innovations Pvt Ltd</p>
            <p className="text-slate-400">GSTIN: 27AAACA0000A1Z5</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Product Item</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Tax Rate</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sale.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 font-semibold text-white">{item.productId?.name || 'Product'}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">₹{item.unitPrice.toLocaleString()}</td>
                <td className="px-4 py-3">18% GST</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">₹{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary */}
        <div className="border-t border-slate-800 pt-4 text-right space-y-1.5 text-xs">
          <p className="text-slate-400">Subtotal Taxable: <span className="font-semibold text-white">₹{sale.subtotal.toLocaleString()}</span></p>
          <p className="text-slate-400">GST Output Tax (18%): <span className="font-semibold text-white">₹{sale.taxAmount.toLocaleString()}</span></p>
          <p className="text-base font-extrabold text-emerald-400 mt-2">Grand Total: ₹{sale.totalAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
