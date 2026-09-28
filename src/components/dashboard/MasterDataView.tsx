import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { 
  Sliders, 
  Lock, 
  Unlock, 
  Building2, 
  Wallet, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const MasterDataView: React.FC = () => {
  const { 
    coa, 
    periods, 
    costCenters, 
    bankAccounts, 
    togglePeriodStatus, 
    currentRole 
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<'coa' | 'periods' | 'cost_centers' | 'banks'>('coa');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTogglePeriod = (periodId: string) => {
    const res = togglePeriodStatus(periodId);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Master Data Finansial & Pengaturan Sistem
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Bagan Akun Standar (COA), Penutupan Periode Fiskal, Cost Center Segmen CBT, dan Rekening Bank.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg border border-primary bg-primary/10 text-xs font-semibold text-primary flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-border text-xs gap-2">
        <button
          onClick={() => setActiveSubTab('coa')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeSubTab === 'coa'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Chart of Accounts (COA) ({coa.length})
        </button>
        <button
          onClick={() => setActiveSubTab('periods')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeSubTab === 'periods'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Periode Fiskal & Kunci Buku ({periods.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cost_centers')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeSubTab === 'cost_centers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Cost Center Segmen ({costCenters.length})
        </button>
        <button
          onClick={() => setActiveSubTab('banks')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeSubTab === 'banks'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Rekening Bank ({bankAccounts.length})
        </button>
      </div>

      {/* Tab 1: COA */}
      {activeSubTab === 'coa' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">Bagan Akun Keuangan (Standar PSAK)</span>
            <span className="text-muted-foreground">Mapping otomatis jurnal Invoice & Pelunasan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-4 font-semibold">Kode Akun</th>
                  <th className="py-2.5 px-4 font-semibold">Nama Akun Finansial</th>
                  <th className="py-2.5 px-4 font-semibold">Klasifikasi Tipe</th>
                  <th className="py-2.5 px-4 font-semibold">Saldo Normal</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Saldo Saat Ini (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {coa.map(acc => (
                  <tr key={acc.account_code} className="hover:bg-muted/40">
                    <td className="py-3 px-4 font-bold text-foreground">{acc.account_code}</td>
                    <td className="py-3 px-4 font-sans font-medium text-foreground">{acc.account_name}</td>
                    <td className="py-3 px-4 font-sans text-muted-foreground">{acc.account_type}</td>
                    <td className="py-3 px-4 font-sans text-muted-foreground">{acc.normal_balance}</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground tabular-nums">
                      {formatIDR(acc.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fiscal Periods */}
      {activeSubTab === 'periods' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border bg-muted/40 flex items-start gap-3 text-xs">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-foreground">Aturan Penguncian FIN-PER-005:</span>
              <p className="text-muted-foreground leading-relaxed">
                Periode yang berstatus <strong className="text-foreground">CLOSED</strong> menolak seluruh posting jurnal baru maupun edit transaksi. 
                Hanya Finance Manager atau Direksi yang berhak membuka/menutup periode.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Nama Periode</th>
                    <th className="py-3 px-4 font-semibold">Rentang Tanggal</th>
                    <th className="py-3 px-4 font-semibold text-center">Status Buku</th>
                    <th className="py-3 px-4 font-semibold">Ditutup Oleh</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {periods.map(per => (
                    <tr key={per.id} className="hover:bg-muted/40">
                      <td className="py-3 px-4 font-bold text-foreground">{per.name}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {per.start_date} s/d {per.end_date}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          per.status === 'OPEN'
                            ? 'bg-[#0f4c3a] text-[#50e3a6] border border-[#1b7359]'
                            : 'bg-[#4a1215] text-[#ff787b] border border-[#7a1c22]'
                        }`}>
                          {per.status === 'OPEN' ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {per.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {per.closed_by ? `${per.closed_by} (${per.closed_at?.substring(0, 10)})` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleTogglePeriod(per.id)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-opacity ${
                            per.status === 'OPEN'
                              ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                              : 'bg-primary text-primary-foreground hover:opacity-90'
                          }`}
                        >
                          {per.status === 'OPEN' ? 'Tutup Periode (Lock)' : 'Buka Periode (Unlock)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cost Centers */}
      {activeSubTab === 'cost_centers' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Kode Cost Center</th>
                  <th className="py-3 px-4 font-semibold">Nama Divisi / Segmen</th>
                  <th className="py-3 px-4 font-semibold">Kategori Pelaporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costCenters.map(cc => (
                  <tr key={cc.code} className="hover:bg-muted/40">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{cc.code}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{cc.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{cc.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Bank Accounts */}
      {activeSubTab === 'banks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bankAccounts.map(b => (
            <div key={b.id} className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground text-sm">{b.bank_name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#0f4c3a] text-[#50e3a6]">
                  AKTIF
                </span>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="text-muted-foreground">
                  Nomor Rekening: <span className="text-foreground font-bold">{b.account_number}</span>
                </div>
                <div className="text-muted-foreground">
                  Atas Nama: <span className="text-foreground">{b.account_holder}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Saldo Riil:</span>
                <span className="font-mono font-bold text-primary text-base tabular-nums">
                  {formatIDR(b.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
