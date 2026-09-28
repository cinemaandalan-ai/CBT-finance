import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo, getInvoiceStatusMeta } from '../../utils/formatters';
import { 
  DollarSign, 
  Wallet, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Percent,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { invoices, payments, journals, taxes, setActiveTab } = useFinance();

  const totalOutstanding = invoices.reduce((acc, curr) => acc + curr.outstanding_amount, 0);
  const totalPaid = invoices.reduce((acc, curr) => acc + curr.amount_paid, 0);
  const totalCash = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyRevenue = invoices
    .filter(i => i.issue_date.startsWith('2025-09'))
    .reduce((acc, curr) => acc + curr.tax_base, 0);

  const missingBupot = taxes.filter(t => t.status === 'PENDING').length;
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  // AR Aging buckets
  const agingCurrent = 87250000;
  const aging1_30 = 0;
  const aging31_60 = 0;
  const aging61_90 = 0;

  return (
    <div className="space-y-6">
      
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Ringkasan Keuangan & Pembukuan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Konsol eksekutif piutang usaha (AR), arus kas bank, rekonsiliasi pajak, dan jurnal akuntansi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-border bg-card text-foreground">
            Bulan Aktif: September 2025
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics (Exact Indonesian figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Outstanding AR */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Piutang Usaha (AR)</span>
            <div className="p-1.5 rounded-md bg-[#14324f] text-[#60b0f4]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground font-mono tabular-nums">
            {formatIDR(totalOutstanding)}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Terbayar: {formatIDR(totalPaid)}</span>
            <span className="text-primary font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('invoices')}>
              Lihat AR →
            </span>
          </div>
        </div>

        {/* KPI 2: Total Kas & Bank */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Penerimaan Kas & Bank</span>
            <div className="p-1.5 rounded-md bg-[#0f4c3a] text-[#50e3a6]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground font-mono tabular-nums">
            {formatIDR(totalCash)}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>3 Transaksi Masuk</span>
            <span className="text-primary font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('payments')}>
              Detail Kas →
            </span>
          </div>
        </div>

        {/* KPI 3: Pendapatan Bulan Ini */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pendapatan Diakui (Sep)</span>
            <div className="p-1.5 rounded-md bg-primary/20 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground font-mono tabular-nums">
            {formatIDR(monthlyRevenue)}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>DPP Eksklusif Pajak</span>
            <span className="text-primary font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('journals')}>
              Buku Jurnal →
            </span>
          </div>
        </div>

        {/* KPI 4: Kepatuhan Pajak / Missing Bupot */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Menunggu Bukti Potong PPh 23</span>
            <div className={`p-1.5 rounded-md ${missingBupot > 0 ? 'bg-[#402e08] text-[#f5c042]' : 'bg-[#0f4c3a] text-[#50e3a6]'}`}>
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground font-mono tabular-nums">
            {missingBupot} Berkas
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Potensi Uang Muka Rp 1.5 Jt</span>
            <span className="text-primary font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('tax')}>
              Validasi Bupot →
            </span>
          </div>
        </div>

      </div>

      {/* Grid: AR Aging Breakdown & Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AR Aging Section (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Analisis Umur Piutang (AR Aging)</h2>
              <p className="text-xs text-muted-foreground">Distribusi tagihan belum lunas berdasarkan masa jatuh tempo</p>
            </div>
            <span className="text-xs font-mono font-bold text-foreground">{formatIDR(totalOutstanding)}</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">Lancar (Current / 0–30 Hari)</span>
                <span className="font-mono text-foreground font-semibold">{formatIDR(agingCurrent)} (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Jatuh Tempo 31–60 Hari</span>
                <span className="font-mono text-muted-foreground font-semibold">Rp 0 (0%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full w-0" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Jatuh Tempo 61–90 Hari</span>
                <span className="font-mono text-muted-foreground font-semibold">Rp 0 (0%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-[#ef4444] rounded-full w-0" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Macet (&gt; 90 Hari / Potensi Write-off)</span>
                <span className="font-mono text-muted-foreground font-semibold">Rp 0 (0%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-[#b91c1c] rounded-full w-0" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Kolektibilitas piutang berada pada batas aman operasional.</span>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Kelola Piutang</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Revenue by Client Segment (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-foreground">Pendapatan Berdasarkan Segmen</h2>
            <p className="text-xs text-muted-foreground">Realisasi omzet sewa CBT per kelompok entitas</p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background">
              <div>
                <span className="font-semibold text-foreground block">CBT Kampus & Universitas</span>
                <span className="text-[11px] text-muted-foreground">Akun 4100 · PMB Gasal</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">Rp 75.000.000</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background">
              <div>
                <span className="font-semibold text-foreground block">Event & Olimpiade Sains</span>
                <span className="text-[11px] text-muted-foreground">Akun 4200 · OSN Regional</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">Rp 8.000.000</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background">
              <div>
                <span className="font-semibold text-foreground block">CBT Sekolah (SMP/SMA/SD)</span>
                <span className="text-[11px] text-muted-foreground">Akun 4000 · Ujian Semester</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">Rp 3.315.000</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Total Realisasi Akrual:</span>
            <span className="font-mono font-bold text-[#50e3a6] tabular-nums">Rp 86.315.000</span>
          </div>
        </div>

      </div>

      {/* Recent Invoices & Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Tagihan Terkini & Status Pelunasan</h2>
            <p className="text-xs text-muted-foreground">Daftar invoice aktif yang membutuhkan tindak lanjut penagihan</p>
          </div>
          <button 
            onClick={() => setActiveTab('invoices')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Seluruh Invoice ({invoices.length})</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2.5 px-3 font-semibold">Nomor Invoice</th>
                <th className="py-2.5 px-3 font-semibold">Klien / Lembaga</th>
                <th className="py-2.5 px-3 font-semibold">Segmen</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Tagihan</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sisa Piutang</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-center">Jurnal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.slice(0, 4).map((inv) => {
                const meta = getInvoiceStatusMeta(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{inv.invoice_number}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{inv.client_name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{inv.client_type}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-foreground tabular-nums">
                      {formatIDR(inv.total_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-primary tabular-nums">
                      {formatIDR(inv.outstanding_amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inv.has_journal ? (
                        <span className="text-[10px] font-bold text-[#50e3a6]">POSTED</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">PENDING</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
