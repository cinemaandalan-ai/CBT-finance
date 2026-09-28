import React, { useState } from 'react';
import { 
  FileSignature, 
  ShoppingCart, 
  Truck, 
  Receipt, 
  CreditCard, 
  Percent, 
  BookOpen, 
  Layers, 
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CycleStep {
  id: string;
  step: string;
  title: string;
  domain: 'Operational' | 'Finance Core' | 'Accounting';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  outputDoc: string;
  accountingImpact: string;
}

const CYCLE_STEPS: CycleStep[] = [
  {
    id: 'mou',
    step: '01',
    title: 'MOU / Kontrak',
    domain: 'Operational',
    icon: FileSignature,
    description: 'Kesepakatan kerja sama sewa sistem CBT, jumlah peserta (kuota), dan paket server.',
    outputDoc: 'MOU/2025/001',
    accountingImpact: 'Komitmen non-finansial (belum ada pencatatan jurnal).'
  },
  {
    id: 'so',
    step: '02',
    title: 'Sales Order (SO)',
    domain: 'Operational',
    icon: ShoppingCart,
    description: 'Pemesanan definitif pelaksanaan ujian per sesi / hari dengan rincian biaya teknisi dan server.',
    outputDoc: 'SO/2025/0001',
    accountingImpact: 'Dasar alokasi anggaran dan acuan penagihan piutang.'
  },
  {
    id: 'do',
    step: '03',
    title: 'Delivery Order / BAST',
    domain: 'Operational',
    icon: Truck,
    description: 'Berita Acara Serah Terima pelaksanaan ujian CBT yang telah ditandatangani proktor/kepala sekolah.',
    outputDoc: 'DO/2025/0001',
    accountingImpact: 'Pemicu pengakuan pendapatan (Revenue Recognition Trigger).'
  },
  {
    id: 'inv',
    step: '04',
    title: 'Invoice / Billing',
    domain: 'Finance Core',
    icon: Receipt,
    description: 'Finance menerbitkan tagihan resmi DPP + PPN 11% beserta kalkulasi estimasi PPh 23.',
    outputDoc: 'INV/2025/0001',
    accountingImpact: 'Jurnal Otomatis: Debit Piutang Usaha, Kredit Pendapatan CBT, Kredit Hutang PPN.'
  },
  {
    id: 'pay',
    step: '05',
    title: 'Penerimaan Pembayaran',
    domain: 'Finance Core',
    icon: CreditCard,
    description: 'Rekonsiliasi transfer bank, alokasi pembayaran single atau multi-invoice, dan penanganan DP.',
    outputDoc: 'PAY/2025/0001',
    accountingImpact: 'Jurnal Otomatis: Debit Bank, Kredit Piutang Usaha.'
  },
  {
    id: 'tax',
    step: '06',
    title: 'Rekonsiliasi PPh 23',
    domain: 'Finance Core',
    icon: Percent,
    description: 'Verifikasi pemotongan 2% oleh klien (sekolah/instansi) dan penerimaan Bukti Potong resmi.',
    outputDoc: 'BP-23/2025/0089',
    accountingImpact: 'Jurnal Otomatis: Debit Piutang PPh 23 (Uang Muka Pajak), bukan biaya!'
  },
  {
    id: 'jv',
    step: '07',
    title: 'Jurnal Berpasangan',
    domain: 'Accounting',
    icon: BookOpen,
    description: 'Pencatatan double-entry otomatis & manual dengan validasi mutlak Debit = Kredit (FIN-BR-002).',
    outputDoc: 'JV/2025/0001',
    accountingImpact: 'Transaksi terkunci jika periode buku telah berstatus CLOSED.'
  },
  {
    id: 'gl',
    step: '08',
    title: 'Buku Besar & Neraca',
    domain: 'Accounting',
    icon: Layers,
    description: 'Mutasi akun per periode dan kompilasi Trial Balance untuk evaluasi kesehatan keuangan.',
    outputDoc: 'General Ledger / TB',
    accountingImpact: 'Drill-down instan ke dokumen sumber (Invoice/Payment/Bupot).'
  }
];

export const CycleFlowSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<CycleStep>(CYCLE_STEPS[3]); // Default to Invoice

  return (
    <section id="siklus" className="border-b border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Arsitektur Alur Bisnis</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground" style={{ textWrap: 'balance' }}>
            Dari Sales Operasional Hingga Jurnal & Laporan Keuangan
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Menghilangkan kesenjangan data antara tim operasional CBT dan bagian akuntansi. 
            Setiap dokumen memiliki relasi relasional yang jelas dan dapat diaudit hingga ke dokumen fisik bukti transfer.
          </p>
        </div>

        {/* Step Cards Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {CYCLE_STEPS.map((step) => {
            const isSelected = selectedStep.id === step.id;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`text-left p-3 rounded-lg border transition-colors flex flex-col justify-between ${
                  isSelected 
                    ? 'border-primary bg-background shadow-sm' 
                    : 'border-border bg-background/50 hover:bg-muted/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.step}
                  </span>
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground truncate">{step.title}</h4>
                  <span className="text-[10px] text-muted-foreground block truncate">{step.domain}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">
                  LANGKAH {selectedStep.step}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Domain: {selectedStep.domain}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">{selectedStep.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedStep.description}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block mb-1">Contoh Dokumen Output:</span>
                  <span className="font-mono font-bold text-foreground">{selectedStep.outputDoc}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block mb-1">Dampak Pembukuan:</span>
                  <span className="text-foreground font-medium">{selectedStep.accountingImpact}</span>
                </div>
              </div>
            </div>

            {/* Quick Audit Rule Callout */}
            <div className="rounded-lg border border-border bg-muted p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Aturan Validasi Kepatuhan</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedStep.id === 'inv' && 'Invoice yang sudah berstatus POSTED terkunci dari perubahan harga atau kuota. Koreksi wajib melalui Credit Note.'}
                {selectedStep.id === 'pay' && 'Alokasi pembayaran mencegah over-allocation dan otomatis membedakan porsi pelunasan vs porsi potongan pajak PPh 23.'}
                {selectedStep.id === 'tax' && 'Pemotongan PPh 23 diakui sebagai Uang Muka Pajak (Asset), bukan biaya langsung, menjaga perhitungan laba bersih tetap akurat.'}
                {selectedStep.id === 'jv' && 'Setiap jurnal yang tersimpan wajib memiliki Total Debit = Total Kredit tanpa toleransi selisih senilai 1 rupiah pun.'}
                {['mou', 'so', 'do', 'gl'].includes(selectedStep.id) && 'Integritas data terhubung langsung ke modul penjualan lokal tanpa perlu re-entry manual yang rentan typo.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
