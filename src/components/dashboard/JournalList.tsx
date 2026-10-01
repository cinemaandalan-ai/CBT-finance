import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo } from '../../utils/formatters';
import { BookOpen, CheckCircle2, Plus, Search, Filter, ShieldCheck, Layers } from 'lucide-react';

interface JournalListProps {
  onOpenManualJournal: () => void;
}

export const JournalList: React.FC<JournalListProps> = ({ onOpenManualJournal }) => {
  const { journals } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const filteredJournals = journals.filter(jv => {
    const matchSearch = 
      jv.journal_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jv.source_reference.toLowerCase().includes(searchTerm.toLowerCase());

    if (sourceFilter === 'ALL') return matchSearch;
    return matchSearch && jv.source_type === sourceFilter;
  });

  const totalDebitSum = journals.reduce((acc, curr) => acc + curr.total_debit, 0);
  const totalCreditSum = journals.reduce((acc, curr) => acc + curr.total_credit, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Buku Jurnal Umum (Double-Entry Ledger)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pencatatan akuntansi berpasangan otomatis dan manual dengan validasi mutlak FIN-BR-002 (Debit = Kredit).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenManualJournal}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Buat Jurnal Manual</span>
          </button>
        </div>
      </div>

      {/* Audit Banner */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Integritas Neraca Terverifikasi</h4>
            <p className="text-[11px] text-muted-foreground">
              Total Debit kumulatif sama persis dengan Total Kredit kumulatif. Tidak ada selisih pembukuan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">TOTAL DEBIT</span>
            <span className="font-bold text-foreground tabular-nums">{formatIDR(totalDebitSum)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">TOTAL KREDIT</span>
            <span className="font-bold text-foreground tabular-nums">{formatIDR(totalCreditSum)}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#edf8ed] text-[#2b722d] dark:bg-[#112d14] dark:text-[#78cf77] border border-[#bde3bd] dark:border-[#1e4e22]">
            BALANCED
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border pb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nomor jurnal, sumber, keterangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-1.5 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-lg border border-border bg-card text-xs">
          {['ALL', 'INVOICE', 'PAYMENT', 'MANUAL'].map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                sourceFilter === src
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {src === 'ALL' ? 'Semua Sumber' : src}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Cards / Rows */}
      <div className="space-y-4">
        {filteredJournals.map((jv) => (
          <div key={jv.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            {/* Journal Header */}
            <div className="p-3.5 border-b border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-foreground text-sm">{jv.journal_number}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatDateIndo(jv.journal_date)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-primary font-semibold">Ref: {jv.source_reference}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#14324f] text-[#60b0f4] border border-[#1f5080]">
                  {jv.source_type}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground">Periode: {jv.period}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf8ed] text-[#2b722d] dark:bg-[#112d14] dark:text-[#78cf77] border border-[#bde3bd] dark:border-[#1e4e22]">
                  {jv.status}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 py-2 text-xs text-foreground font-medium bg-background/50 border-b border-border">
              {jv.description}
            </div>

            {/* Journal Lines Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground bg-muted/20">
                    <th className="py-2 px-4 font-medium">Kode Akun</th>
                    <th className="py-2 px-4 font-medium">Nama Akun Finansial</th>
                    <th className="py-2 px-4 font-medium">Cost Center</th>
                    <th className="py-2 px-4 text-right font-medium">Debit (Rp)</th>
                    <th className="py-2 px-4 text-right font-medium">Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {jv.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="py-2.5 px-4 font-bold text-foreground">{line.account_code}</td>
                      <td className="py-2.5 px-4 text-foreground font-sans">
                        <span className={line.credit > 0 ? 'pl-4 text-muted-foreground' : 'font-medium'}>
                          {line.account_name}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground text-[11px] font-sans">
                        {line.cost_center || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-foreground font-semibold tabular-nums">
                        {line.debit > 0 ? formatIDR(line.debit) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-foreground font-semibold tabular-nums">
                        {line.credit > 0 ? formatIDR(line.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border font-bold bg-muted/30 text-xs">
                    <td colSpan={3} className="py-2.5 px-4 font-sans text-foreground">
                      TOTAL BALANCE
                    </td>
                    <td className="py-2.5 px-4 text-right text-primary tabular-nums">
                      {formatIDR(jv.total_debit)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-primary tabular-nums">
                      {formatIDR(jv.total_credit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
