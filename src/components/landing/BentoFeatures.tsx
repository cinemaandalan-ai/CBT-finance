import React from 'react';
import { 
  Scale, 
  Percent, 
  Receipt, 
  Lock, 
  FileCheck2, 
  Building2,
  ArrowRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BentoFeatures: React.FC = () => {
  const { setViewMode } = useFinance();

  return (
    <section id="fitur" className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Kemampuan Inti</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground" style={{ textWrap: 'balance' }}>
            Fondasi Keuangan Andal Tanpa Celah Kebocoran Pembukuan
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Dirancang berdasarkan evaluasi kelemahan sistem lama (SIS VB/SQL Server). 
            Mengeliminasi selisih pembukuan, keterlambatan penagihan piutang, serta hilangnya berkas bukti potong pajak.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 (Span 2): Auto Journaling */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">01. ENGINE AKUNTANSI BERPASANGAN</span>
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Otomasi Double-Entry Journaling Sesuai Standar SAK
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setiap penerbitan invoice atau pembayaran secara otomatis mengenerate entri jurnal 
                dengan kepastian matematis <strong className="text-foreground">Total Debit = Total Kredit</strong> (FIN-BR-002).
                Sistem menolak penyimpanan jurnal yang timpang, mengeliminasi selisih buku besar selamanya.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg border border-border bg-background">
                <span className="text-muted-foreground block text-[11px]">Akun Piutang</span>
                <span className="text-foreground font-bold">1100 Piutang Usaha</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background">
                <span className="text-muted-foreground block text-[11px]">Akun Pendapatan</span>
                <span className="text-foreground font-bold">4000/4100 CBT</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background">
                <span className="text-muted-foreground block text-[11px]">Hutang Pajak</span>
                <span className="text-foreground font-bold">2100 PPN Keluaran</span>
              </div>
            </div>
          </div>

          {/* Card 2 (Span 1): Tax Compliance */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">02. KEPATUHAN PAJAK</span>
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                PPh 23 Bukti Potong & PPN 11%
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pelacakan bukti potong dari sekolah/kampus secara akurat. Potongan PPh 23 2% langsung diposting ke 
                <strong className="text-foreground"> Piutang PPh 23 (Uang Muka Pajak)</strong>, siap dikreditkan pada SPT Tahunan PPh Badan.
              </p>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-border bg-background text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarif PPh 23:</span>
                <span className="font-mono font-bold text-foreground">2.0% dari DPP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarif PPN:</span>
                <span className="font-mono font-bold text-foreground">11.0% (Standar)</span>
              </div>
            </div>
          </div>

          {/* Card 3 (Span 1): Payment Allocation */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">03. MANAJEMEN KAS</span>
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Alokasi Multi-Faktur & DP
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mendukung pembayaran tunggal untuk melunasi beberapa invoice sekaligus, cicilan bertahap, 
                maupun pencatatan Down Payment (DP) yang belum teralokasi dengan proteksi over-allocation.
              </p>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-border bg-background text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unallocated DP:</span>
                <span className="text-[#60b0f4] font-semibold">Tercatat di Akun 1200</span>
              </div>
            </div>
          </div>

          {/* Card 4 (Span 2): Period Lock & Audit Trail */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">04. KUNCI PERIODE & AUDIT TRAIL</span>
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Kunci Periode Fiskal & Anti-Tamper Reversal
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Begitu laporan bulanan ditutup (CLOSED) oleh Finance Manager, sistem mengunci seluruh transaksi 
                pada rentang tanggal tersebut. Jurnal yang telah diposting tidak dapat diedit atau dihapus secara sepihak, 
                melainkan wajib menggunakan Jurnal Pembalik (Reversal) berotorisasi.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <FileCheck2 className="h-4 w-4 text-[#10b981]" />
                <span>Persetujuan Bertingkat: Staff → Manager → Direksi</span>
              </div>
              <button
                onClick={() => setViewMode('dashboard')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                <span>Lihat Console Pembukuan</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
