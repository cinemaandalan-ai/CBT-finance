import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { X, Plus, Trash2, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface ManualJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormLine {
  account_code: string;
  debit: number;
  credit: number;
  cost_center: string;
}

export const ManualJournalModal: React.FC<ManualJournalModalProps> = ({ isOpen, onClose }) => {
  const { coa, costCenters, addManualJournal } = useFinance();

  const [date, setDate] = useState('2025-09-27');
  const [description, setDescription] = useState('Jurnal Penyesuaian Sewa Server CBT');
  const [lines, setLines] = useState<FormLine[]>([
    { account_code: '5000', debit: 1500000, credit: 0, cost_center: 'CC-KMP' },
    { account_code: '1000', debit: 0, credit: 1500000, cost_center: '' }
  ]);

  if (!isOpen) return null;

  const totalDebit = lines.reduce((acc, curr) => acc + (curr.debit || 0), 0);
  const totalCredit = lines.reduce((acc, curr) => acc + (curr.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleAddLine = () => {
    setLines([...lines, { account_code: '1000', debit: 0, credit: 0, cost_center: '' }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 2) {
      alert('Jurnal berpasangan minimal harus memiliki 2 baris (Debit & Kredit).');
      return;
    }
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleUpdateLine = (idx: number, field: keyof FormLine, value: any) => {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], [field]: value };
    setLines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert(`Jurnal tidak seimbang! Total Debit (${formatIDR(totalDebit)}) != Total Kredit (${formatIDR(totalCredit)}).`);
      return;
    }

    const res = addManualJournal({
      description,
      date,
      lines
    });

    if (res.success) {
      alert(res.message);
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 space-y-5 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Entri Jurnal Memorial (Manual)</h3>
              <p className="text-[11px] text-muted-foreground">Kepatuhan FIN-BR-002: Total Debit wajib persis sama dengan Total Kredit.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Date & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Tanggal Jurnal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-foreground">Deskripsi / Keterangan Memorial</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Beban server tambahan ANBK..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Dynamic Lines Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">Rincian Baris Akun Jurnal</label>
              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <Plus className="h-3 w-3" />
                <span>Tambah Baris</span>
              </button>
            </div>

            <div className="rounded-xl border border-border bg-background overflow-hidden p-2 space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                  {/* Account Selector */}
                  <div className="col-span-5">
                    <select
                      value={line.account_code}
                      onChange={(e) => handleUpdateLine(idx, 'account_code', e.target.value)}
                      className="w-full rounded-md border border-border bg-card px-2 py-1.5 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {coa.map(acc => (
                        <option key={acc.account_code} value={acc.account_code}>
                          {acc.account_code} · {acc.account_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Center */}
                  <div className="col-span-2">
                    <select
                      value={line.cost_center}
                      onChange={(e) => handleUpdateLine(idx, 'cost_center', e.target.value)}
                      className="w-full rounded-md border border-border bg-card px-1.5 py-1.5 text-[10px] text-muted-foreground focus:outline-none"
                    >
                      <option value="">(Cost Center)</option>
                      {costCenters.map(cc => (
                        <option key={cc.code} value={cc.code}>{cc.code}</option>
                      ))}
                    </select>
                  </div>

                  {/* Debit */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Debit"
                      value={line.debit || ''}
                      onChange={(e) => handleUpdateLine(idx, 'debit', Number(e.target.value))}
                      className="w-full rounded-md border border-border bg-card px-2 py-1.5 font-mono text-right text-foreground focus:outline-none"
                    />
                  </div>

                  {/* Credit */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Kredit"
                      value={line.credit || ''}
                      onChange={(e) => handleUpdateLine(idx, 'credit', Number(e.target.value))}
                      className="w-full rounded-md border border-border bg-card px-2 py-1.5 font-mono text-right text-foreground focus:outline-none"
                    />
                  </div>

                  {/* Remove Line */}
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance Checker Box */}
          <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground text-[10px] block font-sans">Total Debit</span>
                <span className="font-bold text-foreground tabular-nums">{formatIDR(totalDebit)}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px] block font-sans">Total Kredit</span>
                <span className="font-bold text-foreground tabular-nums">{formatIDR(totalCredit)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isBalanced ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-[#0f4c3a] text-[#50e3a6] border border-[#1b7359]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  SEIMBANG (BALANCED)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-[#4a1215] text-[#ff787b] border border-[#7a1c22]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  SELISIH {formatIDR(Math.abs(totalDebit - totalCredit))}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isBalanced}
              className={`px-5 py-2 rounded-lg font-semibold transition-opacity ${
                isBalanced
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              Simpan & Posting Jurnal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
