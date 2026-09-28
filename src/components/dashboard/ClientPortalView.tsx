import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo, getInvoiceStatusMeta } from '../../utils/formatters';
import { 
  Building2, 
  Download, 
  Upload, 
  CheckCircle2, 
  FileText, 
  Receipt,
  ExternalLink
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { invoices } = useFinance();
  const [selectedClient, setSelectedClient] = useState<'SMP Cendekia 1' | 'Universitas Teknologi Nusantara'>('SMP Cendekia 1');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const clientInvoices = invoices.filter(i => i.client_name === selectedClient);

  const handleSimulateUpload = (type: 'bukti_transfer' | 'bukti_potong', invNum: string) => {
    setUploadSuccessMsg(
      `Berkas ${type === 'bukti_transfer' ? 'Bukti Transfer Bank' : 'Bukti Potong PPh 23'} untuk tagihan ${invNum} berhasil diunggah dan terkirim ke bagian Finance.`
    );
    setTimeout(() => setUploadSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold mb-1">
            <span>Simulasi Tampilan Portal Klien (Self-Service)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Portal Pembayaran & Berkas Klien
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Area mandiri untuk bendahara sekolah / kampus mengunduh invoice, kwitansi resmi, dan menyerahkan bukti potong PPh 23.
          </p>
        </div>

        {/* Switch Client Profile */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Login Sebagai:</span>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value as any)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="SMP Cendekia 1">SMP Cendekia 1</option>
            <option value="Universitas Teknologi Nusantara">Universitas Teknologi Nusantara</option>
          </select>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3 rounded-lg border border-[#1b7359] bg-[#0f4c3a] text-[#50e3a6] text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Client Overview Card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{selectedClient}</h2>
              <p className="text-xs text-muted-foreground">ID Rekening Klien: CLI-2025-081 · Terdaftar sebagai Rekanan Resmi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground block text-[10px]">TOTAL TAGIHAN</span>
              <span className="font-bold text-foreground tabular-nums">
                {formatIDR(clientInvoices.reduce((a, b) => a + b.total_amount, 0))}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">SISA PIUTANG</span>
              <span className="font-bold text-primary tabular-nums">
                {formatIDR(clientInvoices.reduce((a, b) => a + b.outstanding_amount, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Tagihan Terdaftar ({clientInvoices.length})
          </h3>

          {clientInvoices.map(inv => {
            const meta = getInvoiceStatusMeta(inv.status);
            return (
              <div key={inv.id} className="p-4 rounded-xl border border-border bg-background space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-foreground">{inv.invoice_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Jatuh Tempo: {formatDateIndo(inv.due_date)}
                  </span>
                </div>

                <p className="text-xs text-foreground font-medium">{inv.notes}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">DPP (SEWA)</span>
                    <span className="text-foreground">{formatIDR(inv.subtotal)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">PPN 11%</span>
                    <span className="text-foreground">{formatIDR(inv.vat_amount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">TOTAL DITAGIHKAN</span>
                    <span className="font-bold text-foreground">{formatIDR(inv.total_amount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">ESTIMASI PPh 23 (2%)</span>
                    <span className="text-[#60b0f4]">{formatIDR(inv.pph_amount)}</span>
                  </div>
                </div>

                {/* Self-service Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Mengunduh berkas e-Invoice resmi PDF untuk tagihan ${inv.invoice_number}.`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh Invoice (PDF)</span>
                    </button>
                    {inv.status === 'PAID' && (
                      <button
                        onClick={() => alert(`Mengunduh Kwitansi Pelunasan Resmi untuk tagihan ${inv.invoice_number}.`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Receipt className="h-3.5 w-3.5 text-primary" />
                        <span>Kwitansi Lunas</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSimulateUpload('bukti_transfer', inv.invoice_number)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Bukti Bayar</span>
                    </button>
                    <button
                      onClick={() => handleSimulateUpload('bukti_potong', inv.invoice_number)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      <span>Upload Bupot PPh 23</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
