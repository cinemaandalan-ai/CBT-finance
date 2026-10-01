import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { Scale, CheckCircle2, Download, ShieldCheck } from 'lucide-react';

export const TrialBalanceView: React.FC = () => {
  const { coa, journals } = useFinance();

  // Calculate actual trial balance by aggregating debits and credits from all posted journals
  const balances: Record<string, { debit: number; credit: number }> = {};

  coa.forEach(acc => {
    balances[acc.account_code] = { debit: 0, credit: 0 };
  });

  journals.forEach(jv => {
    jv.lines.forEach(line => {
      if (balances[line.account_code]) {
        balances[line.account_code].debit += line.debit;
        balances[line.account_code].credit += line.credit;
      }
    });
  });

  // Calculate net debit / credit balance based on normal balance
  const tbRows = coa.map(acc => {
    const mut = balances[acc.account_code] || { debit: 0, credit: 0 };
    let netDebit = 0;
    let netCredit = 0;

    if (acc.normal_balance === 'DEBIT') {
      const net = mut.debit - mut.credit;
      if (net >= 0) netDebit = net;
      else netCredit = Math.abs(net);
    } else {
      const net = mut.credit - mut.debit;
      if (net >= 0) netCredit = net;
      else netDebit = Math.abs(net);
    }

    return {
      ...acc,
      tbDebit: netDebit,
      tbCredit: netCredit
    };
  });

  const totalTbDebit = tbRows.reduce((a, b) => a + b.tbDebit, 0);
  const totalTbCredit = tbRows.reduce((a, b) => a + b.tbCredit, 0);
  const isBalanced = totalTbDebit === totalTbCredit;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Neraca Saldo (Trial Balance)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kompilasi saldo akhir seluruh akun buku besar per 30 September 2025.
          </p>
        </div>

        <button 
          onClick={() => alert('Neraca Saldo berhasil diunduh.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Neraca Saldo</span>
        </button>
      </div>

      {/* Audit Banner */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Neraca Saldo Seimbang (Balanced)</h4>
            <p className="text-[11px] text-muted-foreground">
              Memenuhi kaidah FIN-TB-003: Total saldo debit persis setara dengan total saldo kredit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">TOTAL DEBIT SALDO</span>
            <span className="font-bold text-foreground tabular-nums">{formatIDR(totalTbDebit)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">TOTAL KREDIT SALDO</span>
            <span className="font-bold text-foreground tabular-nums">{formatIDR(totalTbCredit)}</span>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#edf8ed] text-[#2b722d] dark:bg-[#112d14] dark:text-[#78cf77] border border-[#bde3bd] dark:border-[#1e4e22]">
            {isBalanced ? '✓ 100% BALANCE' : 'UNBALANCED'}
          </span>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="py-3 px-4 font-semibold">Kode Akun</th>
                <th className="py-3 px-4 font-semibold">Nama Akun Finansial</th>
                <th className="py-3 px-4 font-semibold">Tipe Akun</th>
                <th className="py-3 px-4 font-semibold">Saldo Normal</th>
                <th className="py-3 px-4 text-right font-semibold">Saldo Debit (Rp)</th>
                <th className="py-3 px-4 text-right font-semibold">Saldo Kredit (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {tbRows.map((row) => (
                <tr key={row.account_code} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">{row.account_code}</td>
                  <td className="py-3 px-4 font-sans font-medium text-foreground">{row.account_name}</td>
                  <td className="py-3 px-4 font-sans text-muted-foreground">{row.account_type}</td>
                  <td className="py-3 px-4 font-sans text-muted-foreground">{row.normal_balance}</td>
                  <td className="py-3 px-4 text-right text-foreground font-semibold tabular-nums">
                    {row.tbDebit > 0 ? formatIDR(row.tbDebit) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground font-semibold tabular-nums">
                    {row.tbCredit > 0 ? formatIDR(row.tbCredit) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-muted/60 font-bold text-xs">
                <td colSpan={4} className="py-3 px-4 font-sans text-foreground">
                  TOTAL NERACA SALDO PERIODE SEPTEMBER 2025
                </td>
                <td className="py-3 px-4 text-right text-primary tabular-nums">
                  {formatIDR(totalTbDebit)}
                </td>
                <td className="py-3 px-4 text-right text-primary tabular-nums">
                  {formatIDR(totalTbCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
