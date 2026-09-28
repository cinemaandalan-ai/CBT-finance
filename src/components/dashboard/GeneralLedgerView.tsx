import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo } from '../../utils/formatters';
import { Layers, Download, Search, ChevronRight, FileText } from 'lucide-react';

export const GeneralLedgerView: React.FC = () => {
  const { coa, journals, setActiveTab } = useFinance();
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>('1100'); // Default to Piutang Usaha

  const currentAccount = coa.find(a => a.account_code === selectedAccountCode) || coa[0];

  // Extract all ledger movements for this account from journals
  const movements: {
    id: string;
    date: string;
    journal_number: string;
    source: string;
    description: string;
    debit: number;
    credit: number;
  }[] = [];

  journals.forEach(jv => {
    jv.lines.forEach(line => {
      if (line.account_code === selectedAccountCode) {
        movements.push({
          id: `${jv.id}-${line.account_code}`,
          date: jv.journal_date,
          journal_number: jv.journal_number,
          source: jv.source_reference,
          description: jv.description,
          debit: line.debit,
          credit: line.credit
        });
      }
    });
  });

  // Sort by date ascending
  movements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Compute running balance based on normal balance (DEBIT vs CREDIT)
  let currentBalance = 0;
  const computedRows = movements.map(m => {
    if (currentAccount.normal_balance === 'DEBIT') {
      currentBalance += m.debit - m.credit;
    } else {
      currentBalance += m.credit - m.debit;
    }
    return {
      ...m,
      runningBalance: currentBalance
    };
  });

  const totalDebit = movements.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredit = movements.reduce((acc, curr) => acc + curr.credit, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Buku Besar (General Ledger)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rincian mutasi debit dan kredit per akun dengan pelacakan dokumen sumber (Drill-Down).
          </p>
        </div>

        <button 
          onClick={() => alert(`Buku Besar Akun ${selectedAccountCode} berhasil diekspor ke Excel.`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Account Selector Pill Bar */}
      <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-border bg-card">
        {coa.map(account => (
          <button
            key={account.account_code}
            onClick={() => setSelectedAccountCode(account.account_code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              selectedAccountCode === account.account_code
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>{account.account_code}</span>
            <span className="font-sans truncate max-w-[140px]">{account.account_name}</span>
          </button>
        ))}
      </div>

      {/* Selected Account Overview Card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono font-bold text-primary">AKUN TERPILIH</span>
            <h2 className="text-base font-bold text-foreground">
              {currentAccount.account_code} · {currentAccount.account_name}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground block text-[10px]">TIPE / SALDO NORMAL</span>
              <span className="font-bold text-foreground">{currentAccount.account_type} ({currentAccount.normal_balance})</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">SALDO AKHIR BUKU</span>
              <span className="font-bold text-primary text-sm tabular-nums">{formatIDR(currentBalance)}</span>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/40">
                <th className="py-2.5 px-4 font-semibold">Tanggal</th>
                <th className="py-2.5 px-4 font-semibold">No. Jurnal</th>
                <th className="py-2.5 px-4 font-semibold">Referensi Sumber</th>
                <th className="py-2.5 px-4 font-semibold">Deskripsi Transaksi</th>
                <th className="py-2.5 px-4 text-right font-semibold">Debit (Rp)</th>
                <th className="py-2.5 px-4 text-right font-semibold">Kredit (Rp)</th>
                <th className="py-2.5 px-4 text-right font-semibold">Saldo Berjalan (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {computedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground font-sans">
                    Belum ada mutasi transaksi pada akun ini untuk periode aktif.
                  </td>
                </tr>
              ) : (
                computedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 text-foreground">{formatDateIndo(row.date)}</td>
                    <td className="py-3 px-4 font-bold text-primary">{row.journal_number}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.source}</td>
                    <td className="py-3 px-4 font-sans text-foreground">{row.description}</td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold tabular-nums">
                      {row.debit > 0 ? formatIDR(row.debit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold tabular-nums">
                      {row.credit > 0 ? formatIDR(row.credit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground tabular-nums">
                      {formatIDR(row.runningBalance)}
                    </td>
                  </tr>
                ))
              )}
              {computedRows.length > 0 && (
                <tr className="border-t-2 border-border bg-muted/40 font-bold text-xs">
                  <td colSpan={4} className="py-3 px-4 font-sans text-foreground">
                    TOTAL MUTASI PERIODE INI
                  </td>
                  <td className="py-3 px-4 text-right text-foreground tabular-nums">
                    {formatIDR(totalDebit)}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground tabular-nums">
                    {formatIDR(totalCredit)}
                  </td>
                  <td className="py-3 px-4 text-right text-primary text-sm tabular-nums">
                    {formatIDR(currentBalance)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
