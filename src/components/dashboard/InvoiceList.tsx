import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FinanceInvoice } from '../../types/finance';
import { formatIDR, formatDateIndo, getInvoiceStatusMeta } from '../../utils/formatters';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Plus, 
  FileSpreadsheet,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface InvoiceListProps {
  onSelectInvoice: (invoice: FinanceInvoice) => void;
  onOpenNewPaymentWithInvoice: (invoiceNumber: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ 
  onSelectInvoice,
  onOpenNewPaymentWithInvoice
}) => {
  const { invoices, postInvoice, currentRole } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = 
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && inv.status === statusFilter;
  });

  const handlePostInvoice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = postInvoice(id);
    setFeedbackMsg({ text: result.message, isError: !result.success });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleExportBillingPackage = (inv: FinanceInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Mengunduh Billing Package SPJ untuk ${inv.client_name}:\n- Invoice ${inv.invoice_number}\n- Kwitansi Bermaterai\n- Berita Acara Serah Terima (BAST)\n- Surat Jalan Delivery Order (${inv.do_number || 'DO/2025/0001'})`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Daftar Invoice & Piutang Usaha (AR)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manajemen tagihan operasional CBT, integrasi DO/BAST, validasi pemotongan pajak, dan posting jurnal akrual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Data Invoice berhasil diexport ke format Excel / CSV.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${
          feedbackMsg.isError 
            ? 'bg-[#4a1215] text-[#ff787b] border-[#7a1c22]' 
            : 'bg-[#0f4c3a] text-[#50e3a6] border-[#1b7359]'
        }`}>
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border pb-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nomor invoice / sekolah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-1.5 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-lg border border-border bg-card text-xs">
          {['ALL', 'APPROVED', 'SENT', 'PARTIALLY_PAID', 'PAID', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="py-3 px-4 font-semibold">Nomor Invoice</th>
                <th className="py-3 px-4 font-semibold">Klien & Segmen</th>
                <th className="py-3 px-4 font-semibold">Tgl / Jatuh Tempo</th>
                <th className="py-3 px-4 font-semibold text-right">DPP (Subtotal)</th>
                <th className="py-3 px-4 font-semibold text-right">PPN 11%</th>
                <th className="py-3 px-4 font-semibold text-right">PPh 23 (2%)</th>
                <th className="py-3 px-4 font-semibold text-right">Total Tagihan</th>
                <th className="py-3 px-4 font-semibold text-right">Sisa Piutang</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground">
                    Tidak ada invoice yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const meta = getInvoiceStatusMeta(inv.status);
                  return (
                    <tr 
                      key={inv.id} 
                      onClick={() => onSelectInvoice(inv)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        {inv.invoice_number}
                        {inv.has_journal && (
                          <span className="block text-[10px] text-[#50e3a6] font-normal">
                            ✓ Jurnal Terposting
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block">{inv.client_name}</span>
                        <span className="text-[11px] text-muted-foreground">{inv.client_type} · {inv.cost_center_code}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-foreground block">{formatDateIndo(inv.issue_date)}</span>
                        <span className="text-muted-foreground">JT: {formatDateIndo(inv.due_date)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                        {formatIDR(inv.subtotal)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                        {formatIDR(inv.vat_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#60b0f4]">
                        {formatIDR(inv.pph_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground tabular-nums">
                        {formatIDR(inv.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-primary tabular-nums">
                        {formatIDR(inv.outstanding_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Post Journal Button */}
                          {!inv.has_journal && inv.status === 'APPROVED' && (
                            <button
                              onClick={(e) => handlePostInvoice(inv.id, e)}
                              title="Posting Jurnal Otomatis (FIN-INV-006)"
                              className="px-2 py-1 rounded bg-[#0f4c3a] text-[#50e3a6] border border-[#1b7359] text-[10px] font-bold hover:opacity-80"
                            >
                              Post Jurnal
                            </button>
                          )}

                          {/* Quick Pay Button */}
                          {inv.outstanding_amount > 0 && (
                            <button
                              onClick={() => onOpenNewPaymentWithInvoice(inv.invoice_number)}
                              title="Catat Pelunasan"
                              className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-semibold hover:opacity-90"
                            >
                              Bayar
                            </button>
                          )}

                          {/* SPJ Package */}
                          {inv.client_type === 'Diknas' && (
                            <button
                              onClick={(e) => handleExportBillingPackage(inv, e)}
                              title="Download SPJ Billing Package (FIN-BR-013)"
                              className="p-1 rounded border border-border text-foreground hover:bg-muted"
                            >
                              <FileCheck className="h-3.5 w-3.5 text-primary" />
                            </button>
                          )}

                          {/* View Detail */}
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            className="p-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Audit Notice */}
        <div className="p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Aturan FIN-BR-001: Invoice yang telah diposting tidak dapat diubah harganya (Koreksi wajib via Credit Note).
          </span>
          <span className="font-mono text-foreground font-semibold">
            Total Piutang Berjalan: {formatIDR(invoices.reduce((a, b) => a + b.outstanding_amount, 0))}
          </span>
        </div>
      </div>

    </div>
  );
};
