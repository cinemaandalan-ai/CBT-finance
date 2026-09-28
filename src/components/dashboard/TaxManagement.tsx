import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo, getTaxStatusMeta } from '../../utils/formatters';
import { Percent, CheckCircle2, AlertCircle, FileText, Upload, ShieldCheck, Download } from 'lucide-react';

export const TaxManagement: React.FC = () => {
  const { taxes, invoices, validateTaxRecord } = useFinance();
  const [selectedTaxId, setSelectedTaxId] = useState<string | null>(null);
  const [inputBupotNumber, setInputBupotNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const totalVatOutput = invoices.reduce((acc, curr) => acc + curr.vat_amount, 0);
  const totalWhtRecorded = taxes.reduce((acc, curr) => acc + curr.tax_amount, 0);
  const totalValidated = taxes.filter(t => t.status === 'VALIDATED').reduce((acc, curr) => acc + curr.tax_amount, 0);
  const totalPending = taxes.filter(t => t.status === 'PENDING').reduce((acc, curr) => acc + curr.tax_amount, 0);

  const handleOpenValidate = (taxId: string) => {
    setSelectedTaxId(taxId);
    setInputBupotNumber(`BP-23/2025/00${Math.floor(10 + Math.random() * 89)}`);
    setModalOpen(true);
  };

  const handleConfirmValidate = () => {
    if (selectedTaxId && inputBupotNumber) {
      validateTaxRecord(selectedTaxId, inputBupotNumber);
      setModalOpen(false);
      setSelectedTaxId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Perpajakan & Bukti Potong (PPh 23 & PPN)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pelacakan dokumen e-Bupot Unifikasi PPh 23, rekonsiliasi PPN Keluaran 11%, dan kepatuhan SPT Masa.
          </p>
        </div>

        <button 
          onClick={() => alert('Rekapitulasi Faktur Pajak & PPh 23 berhasil diunduh untuk upload e-Faktur DJP.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Rekap Pajak DJP</span>
        </button>
      </div>

      {/* Tax Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs text-muted-foreground">Total PPN 11% Keluaran</span>
          <span className="text-xl font-bold font-mono text-foreground tabular-nums block">
            {formatIDR(totalVatOutput)}
          </span>
          <span className="text-[11px] text-muted-foreground">Akun 2100 Hutang PPN</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs text-muted-foreground">Total Piutang PPh 23 (Prepayment)</span>
          <span className="text-xl font-bold font-mono text-[#60b0f4] tabular-nums block">
            {formatIDR(totalWhtRecorded)}
          </span>
          <span className="text-[11px] text-muted-foreground">Akun 1110 Uang Muka Pajak</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs text-muted-foreground">Bukti Potong Tervalidasi</span>
          <span className="text-xl font-bold font-mono text-[#50e3a6] tabular-nums block">
            {formatIDR(totalValidated)}
          </span>
          <span className="text-[11px] text-[#50e3a6]">Siap dikreditkan di SPT Badan</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs text-muted-foreground">Menunggu Bukti Potong Klien</span>
          <span className="text-xl font-bold font-mono text-[#f5c042] tabular-nums block">
            {formatIDR(totalPending)}
          </span>
          <span className="text-[11px] text-[#f5c042]">Tagih berkas ke sekolah/kampus</span>
        </div>
      </div>

      {/* Notice Card for FIN-BR-010 */}
      <div className="p-4 rounded-xl border border-border bg-muted/40 flex items-start gap-3 text-xs">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Kepatuhan Standar FIN-BR-010:</p>
          <p className="text-muted-foreground leading-relaxed">
            Pemotongan PPh 23 oleh pihak ketiga (klien sekolah/kampus) secara otomatis diperlakukan sebagai 
            <strong className="text-foreground"> Piutang PPh 23 (Aktiva Lancar)</strong>, bukan sebagai beban biaya. 
            Hal ini memastikan nilai omzet kotor tetap utuh dan hak kredit pajak perusahaan tidak hangus saat tutup buku tahunan.
          </p>
        </div>
      </div>

      {/* Withholding Tax Records Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground">Daftar Bukti Potong PPh 23 (Tarif 2%)</h2>
          <span className="text-xs text-muted-foreground font-mono">{taxes.length} Catatan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 px-4 font-semibold">No. Invoice Terkait</th>
                <th className="py-3 px-4 font-semibold">Klien Pemotong</th>
                <th className="py-3 px-4 font-semibold text-right">DPP (Dasar Pajak)</th>
                <th className="py-3 px-4 font-semibold text-right">Tarif</th>
                <th className="py-3 px-4 font-semibold text-right">Nominal PPh 23</th>
                <th className="py-3 px-4 font-semibold">Nomor Bukti Potong</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {taxes.map((tax) => {
                const meta = getTaxStatusMeta(tax.status);
                return (
                  <tr key={tax.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {tax.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {tax.client_name}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                      {formatIDR(tax.tax_base)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-foreground">
                      {tax.tax_rate}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#60b0f4] tabular-nums">
                      {formatIDR(tax.tax_amount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {tax.evidence_number ? (
                        <span className="text-foreground font-semibold">{tax.evidence_number}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Belum diinput</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {tax.status !== 'VALIDATED' ? (
                        <button
                          onClick={() => handleOpenValidate(tax.id)}
                          className="px-2.5 py-1 rounded bg-primary text-primary-foreground font-semibold text-[10px] hover:opacity-90 transition-opacity"
                        >
                          Validasi e-Bupot
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#50e3a6] font-bold">✓ Tervalidasi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-foreground">Input & Validasi Bukti Potong DJP</h3>
            <p className="text-xs text-muted-foreground">
              Masukkan nomor bukti potong resmi dari portal e-Bupot DJP untuk mencocokkan uang muka pajak.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Nomor Bukti Potong (BP-23)</label>
              <input
                type="text"
                value={inputBupotNumber}
                onChange={(e) => setInputBupotNumber(e.target.value)}
                placeholder="Contoh: BP-23/2025/0089"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmValidate}
                className="px-4 py-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Konfirmasi Validasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
