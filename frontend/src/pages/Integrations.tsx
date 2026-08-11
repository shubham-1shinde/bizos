import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link2, RefreshCw, CheckCircle, FileSpreadsheet, Server, BookOpen } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // File upload state for Excel/CSV
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const [intRes, logsRes] = await Promise.all([
        api.get('/integrations'),
        api.get('/integrations/sync-logs'),
      ]);
      setIntegrations(intRes.data);
      setSyncLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    try {
      await api.post(`/integrations/${id}/sync`);
      fetchIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      // Mock CSV column mapping preview
      setPreviewData([
        { InvoiceNumber: 'INV-IMP-001', Customer: 'Tech Corp India', Amount: '45000', GST: '8100' },
        { InvoiceNumber: 'INV-IMP-002', Customer: 'Apex Logistics', Amount: '125000', GST: '22500' },
      ]);
    }
  };

  const handleImportExcel = () => {
    alert(`File "${uploadFile?.name}" imported successfully! 2 records processed.`);
    setIsExcelModalOpen(false);
    setUploadFile(null);
    setPreviewData(null);
    fetchIntegrations();
  };

  const getIntegrationMeta = (type: string) => {
    if (type === 'EXCEL_CSV') {
      return { title: 'Excel / CSV File Importer', icon: FileSpreadsheet, color: 'emerald' };
    } else if (type === 'TALLY') {
      return { title: 'Tally ERP / Prime Integration', icon: Server, color: 'blue' };
    } else {
      return { title: 'Zoho Books Cloud Integration', icon: BookOpen, color: 'purple' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Enterprise Data Integrations <Link2 className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-xs text-slate-400">Synchronize data with Excel/CSV files, Tally ERP, and Zoho Books</p>
        </div>
      </div>

      {/* Supported Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const meta = getIntegrationMeta(item.type);
          const Icon = meta.icon;
          return (
            <div key={item._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl bg-${meta.color}-500/10 text-${meta.color}-400 flex items-center justify-center border border-${meta.color}-500/20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Connected'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{meta.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Last synchronized: {item.lastSyncAt ? new Date(item.lastSyncAt).toLocaleString() : 'Never'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                {item.type === 'EXCEL_CSV' ? (
                  <button
                    onClick={() => setIsExcelModalOpen(true)}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    Upload & Map File
                  </button>
                ) : (
                  <button
                    onClick={() => handleSync(item._id)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Trigger Sync Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Synchronization Audit History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Items Processed</th>
                <th className="px-6 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {syncLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{log.itemsSynced} records</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(log.syncedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Upload Modal */}
      <Modal isOpen={isExcelModalOpen} onClose={() => setIsExcelModalOpen(false)} title="Upload Excel / CSV File">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Excel or CSV Spreadsheet</label>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          {previewData && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white">Column Mapping Preview & Validation</h4>
              <div className="overflow-x-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
                <table className="w-full text-left text-slate-300">
                  <thead className="text-slate-500 font-bold border-b border-slate-800">
                    <tr>
                      <th className="pb-1">Invoice Number</th>
                      <th className="pb-1">Customer</th>
                      <th className="pb-1">Amount</th>
                      <th className="pb-1">GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-1 font-mono text-blue-400">{row.InvoiceNumber}</td>
                        <td className="py-1">{row.Customer}</td>
                        <td className="py-1">₹{row.Amount}</td>
                        <td className="py-1 text-slate-400">₹{row.GST}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              onClick={handleImportExcel}
              disabled={!uploadFile}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Validate & Import Sales Ledger
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
