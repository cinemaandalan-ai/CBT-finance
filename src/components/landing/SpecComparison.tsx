import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Check, X, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export const SpecComparison: React.FC = () => {
  const { setViewMode } = useFinance();

  return (
    <section id="arsitektur" className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Evolusi Arsitektur</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground" style={{ textWrap: 'balance' }}>
            Menggantikan Legacy SIS Menjadi Sistem Keuangan Modern
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Sistem warisan SIS berbasis VB & SQL Server memiliki bug yang tidak terselesaikan dan gagal menyajikan laporan keuangan yang akuntabel.
            Berikut perbandingan kemampuan sistem baru yang dibangun untuk kepatuhan audit.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                  <th className="py-3.5 px-4 font-semibold">Parameter Fitur Finansial</th>
                  <th className="py-3.5 px-4 font-semibold text-destructive">Legacy SIS (Aplikasi Lama)</th>
                  <th className="py-3.5 px-4 font-semibold text-primary">CBT Finance Module (Baru)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    Integritas Jurnal (Double Entry)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <X className="h-4 w-4 shrink-0" />
                      <span>Sering terjadi selisih debit & kredit di database</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>Validasi mutlak Debit = Kredit (FIN-BR-002)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    Penanganan Pemotongan Pajak PPh 23
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <X className="h-4 w-4 shrink-0" />
                      <span>Dicatat sembarangan sebagai biaya langsung atau hilang</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>Tercatat otomatis sebagai Piutang PPh 23 (Uang Muka)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    Kunci Periode Audit (Closing Period)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <X className="h-4 w-4 shrink-0" />
                      <span>Transaksi bulan lalu bisa diubah tanpa persetujuan</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>Periode terkunci mutlak, wajib jurnal pembalik resmi</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    Alokasi Pembayaran Fleksibel
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <X className="h-4 w-4 shrink-0" />
                      <span>Hanya 1 transfer untuk 1 invoice kaku</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>Mendukung multi-invoice, cicilan, dan saldo DP</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    Portal Mandiri Klien (Sekolah / Kampus)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <X className="h-4 w-4 shrink-0" />
                      <span>Kirim bukti transfer manual via WhatsApp/email</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>Portal klien untuk unduh invoice & upload bukti transfer</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-border p-4 bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Sesuai panduan migrasi dokumen spesifikasi Bagian 15: Cut-off data saldo awal & arsip read-only SIS.
            </span>
            <button
              onClick={() => setViewMode('dashboard')}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span>Uji Coba di Dashboard Admin</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
