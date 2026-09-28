import React from 'react';
import { FinanceInvoice } from '../../types/finance';
import { formatIDR, formatDateIndo, getInvoiceStatusMeta } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { X, Download, CheckCircle, FileText, Building2, Truck, ShoppingCart, FileSignature } from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: FinanceInvoice | null;
  onClose: () => void;
  onOpenNewPayment: (invoiceNumber: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onOpenNewPayment
}) => {
  const { postInvoice, journals } = useFinance();

  if (!invoice) return null;

  const meta = getInvoiceStatusMeta(invoice.status);
  const linkedJournal = journals.find(j => j.source_reference === invoice.invoice_number);

  const handlePost = () => {
    const res = postInvoice(invoice.id);
    alert(res.message);
  };

  const handleDownloadPDF = () => {
    alert(`Mengunduh file PDF resmi: ${invoice.invoice_number.replace(/\//g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 space-y-6 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              INV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground font-mono">{invoice.invoice_number}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${meta.bg} ${meta.text} ${meta.border}`}>
                  {meta.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{invoice.client_name} · {invoice.client_type}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Linked Operational Chain (MOU -> SO -> DO) */}
        <div className="p-3.5 rounded-xl border border-border bg-background space-y-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Jejak Rantai Dokumen Penjualan (Sales Integration)
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-card border border-border">
              <span className="text-[10px] text-muted-foreground block">Kontrak MOU:</span>
              <span className="font-bold text-foreground">{invoice.mou_number || 'Tanpa MOU (Langsung SO)'}</span>
            </div>
            <div className="p-2 rounded bg-card border border-border">
              <span className="text-[10px] text-muted-foreground block">Sales Order:</span>
              <span className="font-bold text-foreground">{invoice.so_number || '-'}</span>
            </div>
            <div className="p-2 rounded bg-card border border-border">
              <span className="text-[10px] text-muted-foreground block">Surat Jalan / BAST:</span>
              <span className="font-bold text-foreground">{invoice.do_number || '-'}</span>
            </div>
          </div>
        </div>

        {/* Financial Numbers Breakdown */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Rincian Nilai Finansial & Perpajakan
          </span>
          <div className="rounded-xl border border-border bg-background p-4 space-y-2 font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span className="font-sans">Dasar Pengenaan Pajak (DPP / Sewa):</span>
              <span className="font-bold text-foreground tabular-nums">{formatIDR(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="font-sans">PPN {invoice.vat_rate}% (Faktur Pajak):</span>
              <span className="font-bold text-foreground tabular-nums">{formatIDR(invoice.vat_amount)}</span>
            </div>
            <div className="flex justify-between text-foreground font-bold pt-2 border-t border-border text-sm">
              <span className="font-sans">Total Tagihan Akrual:</span>
              <span className="tabular-nums">{formatIDR(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between text-[#60b0f4] pt-1 border-t border-border">
              <span className="font-sans">Estimasi Pemotongan PPh 23 ({invoice.pph_rate}%):</span>
              <span className="tabular-nums">(-) {formatIDR(invoice.pph_amount)}</span>
            </div>
            <div className="flex justify-between text-[#50e3a6] font-bold pt-1">
              <span className="font-sans">Estimasi Kas Bersih Ditransfer Klien:</span>
              <span className="tabular-nums">{formatIDR(invoice.total_amount - invoice.pph_amount)}</span>
            </div>
            <div className="flex justify-between text-primary font-bold pt-2 border-t border-border text-sm">
              <span className="font-sans">Sisa Piutang Berjalan:</span>
              <span className="tabular-nums">{formatIDR(invoice.outstanding_amount)}</span>
            </div>
          </div>
        </div>

        {/* Linked Journal Status */}
        <div className="p-3.5 rounded-xl border border-border bg-background space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Status Jurnal Akuntansi</span>
            {invoice.has_journal ? (
              <span className="px-2 py-0.5 rounded bg-[#0f4c3a] text-[#50e3a6] font-bold text-[10px]">
                TERPOSTING (POSTED)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#402e08] text-[#f5c042] font-bold text-[10px]">
                BELUM DIPOSTING
              </span>
            )}
          </div>
          {linkedJournal ? (
            <div className="text-[11px] font-mono text-muted-foreground space-y-1">
              <p>Nomor Jurnal: <strong className="text-foreground">{linkedJournal.journal_number}</strong></p>
              <div className="space-y-0.5 pt-1">
                {linkedJournal.lines.map((l, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{l.account_code} {l.account_name}</span>
                    <span>{l.debit > 0 ? `D: ${formatIDR(l.debit)}` : `K: ${formatIDR(l.credit)}`}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Invoice ini belum diposting ke jurnal akrual piutang. Klik tombol di bawah untuk mengenerate entri jurnal seimbang.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh e-Invoice PDF</span>
          </button>

          <div className="flex gap-2">
            {!invoice.has_journal && (
              <button
                onClick={handlePost}
                className="px-4 py-2 rounded-lg bg-[#0f4c3a] text-[#50e3a6] border border-[#1b7359] text-xs font-bold hover:opacity-90"
              >
                Posting ke Jurnal
              </button>
            )}

            {invoice.outstanding_amount > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onOpenNewPayment(invoice.invoice_number);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
              >
                Catat Pembayaran
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
