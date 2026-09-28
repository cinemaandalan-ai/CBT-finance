import React, { useState } from 'react';
import { formatIDR } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { Calculator, CheckCircle2, ArrowRight, RefreshCw, Scale } from 'lucide-react';

export const JournalSimulator: React.FC = () => {
  const { setViewMode, recordPayment } = useFinance();
  const [subtotal, setSubtotal] = useState<number>(10000000);
  const [includeVat, setIncludeVat] = useState<boolean>(true);
  const [includePph, setIncludePph] = useState<boolean>(true);
  const [segment, setSegment] = useState<'sekolah' | 'kampus' | 'olimpiade'>('sekolah');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const vatAmount = includeVat ? Math.round(subtotal * 0.11) : 0;
  const pphAmount = includePph ? Math.round(subtotal * 0.02) : 0;
  const totalInvoice = subtotal + vatAmount;
  const netBankReceived = totalInvoice - pphAmount;

  let revAccountCode = '4000';
  let revAccountName = 'Pendapatan CBT Sekolah';
  if (segment === 'kampus') {
    revAccountCode = '4100';
    revAccountName = 'Pendapatan CBT Kampus';
  } else if (segment === 'olimpiade') {
    revAccountCode = '4200';
    revAccountName = 'Pendapatan Event & Olimpiade';
  }

  const handleSimulateToDashboard = () => {
    // Switch directly to dashboard to inspect live ledger
    setViewMode('dashboard');
  };

  return (
    <section id="simulator" className="border-b border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Simulasi Interaktif</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground" style={{ textWrap: 'balance' }}>
            Simulator Jurnal Berpasangan & Pemotongan Pajak
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Uji coba logika jurnal otomatis sesuai kaidah akuntansi FIN-BR-011 dan FIN-BR-012. 
            Lihat bagaimana sistem membagi komponen pendapatan, PPN keluaran, serta uang muka PPh 23 secara seimbang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 rounded-xl border border-border bg-background p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Parameter Transaksi CBT</h3>
              </div>
              <button
                onClick={() => {
                  setSubtotal(10000000);
                  setIncludeVat(true);
                  setIncludePph(true);
                  setSegment('sekolah');
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Subtotal Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Nilai DPP (Dasar Pengenaan Pajak / Subtotal)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rp</span>
                <input
                  type="number"
                  step="500000"
                  min="100000"
                  value={subtotal}
                  onChange={(e) => setSubtotal(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 pl-9 text-sm font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[3000000, 10000000, 25000000, 75000000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSubtotal(amt)}
                    className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                      subtotal === amt ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {amt >= 1000000 ? `${amt / 1000000} Jt` : `${amt / 1000} Rb`}
                  </button>
                ))}
              </div>
            </div>

            {/* Segment Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Segmen Klien & Pendapatan</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSegment('sekolah')}
                  className={`py-2 px-2 text-xs rounded border text-center transition-colors ${
                    segment === 'sekolah' ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sekolah (4000)
                </button>
                <button
                  onClick={() => setSegment('kampus')}
                  className={`py-2 px-2 text-xs rounded border text-center transition-colors ${
                    segment === 'kampus' ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Kampus (4100)
                </button>
                <button
                  onClick={() => setSegment('olimpiade')}
                  className={`py-2 px-2 text-xs rounded border text-center transition-colors ${
                    segment === 'olimpiade' ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Event (4200)
                </button>
              </div>
            </div>

            {/* Tax Toggles */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-foreground block">PPN 11% (Faktur Keluaran)</span>
                  <span className="text-[11px] text-muted-foreground">Klien Kena Pajak (PKP)</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeVat}
                  onChange={(e) => setIncludeVat(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-foreground block">PPh 23 Dipotong Klien 2%</span>
                  <span className="text-[11px] text-muted-foreground">Jasa persewaan sistem / teknologi</span>
                </div>
                <input
                  type="checkbox"
                  checked={includePph}
                  onChange={(e) => setIncludePph(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
              </label>
            </div>

            {/* Calculation Summary */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>DPP (Subtotal):</span>
                <span className="font-mono text-foreground">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>PPN 11%:</span>
                <span className="font-mono text-foreground">{formatIDR(vatAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
                <span>Total Invoice:</span>
                <span className="font-mono tabular-nums">{formatIDR(totalInvoice)}</span>
              </div>
              <div className="flex justify-between text-[#60b0f4] pt-1">
                <span>Potongan PPh 23 (2% x DPP):</span>
                <span className="font-mono tabular-nums">(-) {formatIDR(pphAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#50e3a6] pt-1 border-t border-border">
                <span>Penerimaan Kas/Bank Bersih:</span>
                <span className="font-mono tabular-nums">{formatIDR(netBankReceived)}</span>
              </div>
            </div>

          </div>

          {/* Generated Journals Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Journal 1: Invoice Posting */}
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-primary">FASE 1: PENERBITAN INVOICE (AKRUAL)</span>
                  <h4 className="text-sm font-bold text-foreground">Jurnal Piutang & Pengakuan Pendapatan</h4>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#10b981]">
                  <CheckCircle2 className="h-4 w-4" />
                  Balanced
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2">Kode Akun & Deskripsi</th>
                      <th className="py-2 text-right">Debit (Rp)</th>
                      <th className="py-2 text-right">Kredit (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    <tr>
                      <td className="py-2 text-foreground font-semibold">1100 · Piutang Usaha (AR)</td>
                      <td className="py-2 text-right text-foreground font-bold tabular-nums">{formatIDR(totalInvoice)}</td>
                      <td className="py-2 text-right text-muted-foreground">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground pl-4">{revAccountCode} · {revAccountName}</td>
                      <td className="py-2 text-right text-muted-foreground">-</td>
                      <td className="py-2 text-right text-foreground tabular-nums">{formatIDR(subtotal)}</td>
                    </tr>
                    {includeVat && (
                      <tr>
                        <td className="py-2 text-muted-foreground pl-4">2100 · Hutang PPN (VAT Payable)</td>
                        <td className="py-2 text-right text-muted-foreground">-</td>
                        <td className="py-2 text-right text-foreground tabular-nums">{formatIDR(vatAmount)}</td>
                      </tr>
                    )}
                    <tr className="font-bold border-t-2 border-border bg-card">
                      <td className="py-2 text-foreground">TOTAL JURNAL INVOICE</td>
                      <td className="py-2 text-right text-[#50e3a6] tabular-nums">{formatIDR(totalInvoice)}</td>
                      <td className="py-2 text-right text-[#50e3a6] tabular-nums">{formatIDR(totalInvoice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Journal 2: Payment Receipt & PPh 23 Prepayment */}
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-primary">FASE 2: PELUNASAN KAS / BANK</span>
                  <h4 className="text-sm font-bold text-foreground">Jurnal Penerimaan Bank & Bukti Potong PPh 23</h4>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#10b981]">
                  <CheckCircle2 className="h-4 w-4" />
                  Balanced
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2">Kode Akun & Deskripsi</th>
                      <th className="py-2 text-right">Debit (Rp)</th>
                      <th className="py-2 text-right">Kredit (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    <tr>
                      <td className="py-2 text-foreground font-semibold">1000 · Kas & Bank (BCA / Mandiri)</td>
                      <td className="py-2 text-right text-foreground font-bold tabular-nums">{formatIDR(netBankReceived)}</td>
                      <td className="py-2 text-right text-muted-foreground">-</td>
                    </tr>
                    {includePph && (
                      <tr>
                        <td className="py-2 text-[#60b0f4] font-semibold">1110 · Piutang PPh 23 (Tax Prepayment)</td>
                        <td className="py-2 text-right text-[#60b0f4] font-bold tabular-nums">{formatIDR(pphAmount)}</td>
                        <td className="py-2 text-right text-muted-foreground">-</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2 text-muted-foreground pl-4">1100 · Piutang Usaha (AR)</td>
                      <td className="py-2 text-right text-muted-foreground">-</td>
                      <td className="py-2 text-right text-foreground font-bold tabular-nums">{formatIDR(totalInvoice)}</td>
                    </tr>
                    <tr className="font-bold border-t-2 border-border bg-card">
                      <td className="py-2 text-foreground">TOTAL JURNAL PEMBAYARAN</td>
                      <td className="py-2 text-right text-[#50e3a6] tabular-nums">{formatIDR(totalInvoice)}</td>
                      <td className="py-2 text-right text-[#50e3a6] tabular-nums">{formatIDR(totalInvoice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSimulateToDashboard}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <span>Buka di Buku Besar Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
