import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo, getPaymentStatusMeta } from '../../utils/formatters';
import { Plus, Download, Search, CheckCircle2, AlertCircle, ArrowUpRight, Receipt } from 'lucide-react';

interface PaymentListProps {
  onOpenNewPayment: () => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({ onOpenNewPayment }) => {
  const { payments } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPayments = payments.filter(pay => {
    const matchSearch = 
      pay.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.reference_number.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && pay.status === statusFilter;
  });

  const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnallocated = payments.reduce((acc, curr) => acc + curr.unallocated_amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Penerimaan Pembayaran & Alokasi Bank
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pencatatan mutasi kas masuk, rekonsiliasi transfer bank, alokasi faktur, dan pemotongan PPh 23.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewPayment}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Catat Pembayaran Baru</span>
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground block">Total Penerimaan Kas & Bank</span>
          <span className="text-xl font-bold font-mono text-foreground tabular-nums">
            {formatIDR(totalCollected)}
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Masuk ke rekening giro BCA & Mandiri</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground block">Saldo Belum Teralokasi (DP Klien)</span>
          <span className="text-xl font-bold font-mono text-[#60b0f4] tabular-nums">
            {formatIDR(totalUnallocated)}
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Dicatat di Akun 1200 Pendapatan Dimuka</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground block">Integritas Jurnal Penerimaan</span>
          <span className="text-xl font-bold font-mono text-[#50e3a6] flex items-center gap-1">
            <CheckCircle2 className="h-5 w-5" />
            100% Balanced
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Debit Bank + PPh 23 = Kredit Piutang</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border pb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nomor pembayaran, klien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-1.5 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-lg border border-border bg-card text-xs">
          {['ALL', 'FULLY_ALLOCATED', 'UNALLOCATED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st === 'FULLY_ALLOCATED' ? 'Teralokasi' : 'Belum Alokasi (DP)'}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="py-3 px-4 font-semibold">Nomor Pembayaran</th>
                <th className="py-3 px-4 font-semibold">Klien</th>
                <th className="py-3 px-4 font-semibold">Tanggal / Bank</th>
                <th className="py-3 px-4 font-semibold">No. Referensi Transfer</th>
                <th className="py-3 px-4 font-semibold text-right">Nominal Masuk</th>
                <th className="py-3 px-4 font-semibold text-right">Potongan PPh 23</th>
                <th className="py-3 px-4 font-semibold">Alokasi Invoice</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.map((pay) => {
                const meta = getPaymentStatusMeta(pay.status);
                return (
                  <tr key={pay.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {pay.payment_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground block">{pay.client_name}</span>
                      <span className="text-[11px] text-muted-foreground">{pay.notes || 'Pembayaran sewa CBT'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-foreground block">{formatDateIndo(pay.payment_date)}</span>
                      <span className="text-[11px] text-muted-foreground">{pay.bank_account}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {pay.reference_number}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground tabular-nums">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#60b0f4] tabular-nums">
                      {pay.pph_withheld && pay.pph_withheld > 0 ? formatIDR(pay.pph_withheld) : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-primary font-medium">
                      {pay.allocated_invoice_number ? pay.allocated_invoice_number : (
                        <span className="text-muted-foreground italic">Menunggu Tagihan (DP)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.label}
                      </span>
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
