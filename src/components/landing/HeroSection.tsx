import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndo, getInvoiceStatusMeta } from '../../utils/formatters';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Layers, Scale } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setViewMode, invoices, journals, taxes } = useFinance();
  const [activePreviewTab, setActivePreviewTab] = useState<'invoices' | 'journals' | 'tax'>('invoices');

  const totalOutstanding = invoices.reduce((acc, curr) => acc + curr.outstanding_amount, 0);
  const totalPaid = invoices.reduce((acc, curr) => acc + curr.amount_paid, 0);

  return (
    <section className="relative border-b border-border bg-background pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Spesifikasi Add-on Keuangan & Akuntansi CBT v1.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]" style={{ textWrap: 'balance' }}>
              Sistem Keuangan & Akuntansi Siklus Bisnis CBT
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Dirancang khusus untuk entitas persewaan server & ujian CBT. Menghubungkan alur operasional 
              <strong className="text-foreground font-semibold"> MOU → SO → DO </strong> 
              menjadi invoice akrual, alokasi pembayaran multi-faktur, rekonsiliasi bukti potong PPh 23, serta jurnal umum berpasangan yang selalu seimbang.
            </p>

            {/* Micro value indicators */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-y border-border py-4 max-w-xl">
              <div>
                <p className="text-xs text-muted-foreground">Kepatuhan Pajak</p>
                <p className="text-sm font-bold text-foreground">PPN 11% & PPh 23</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Integritas Jurnal</p>
                <p className="text-sm font-bold text-foreground">100% Balanced</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kunci Periode</p>
                <p className="text-sm font-bold text-foreground">Anti-Tamper Lock</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setViewMode('dashboard')}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>Buka Dashboard Admin (Live Demo)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#simulator"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <span>Coba Simulator Jurnal</span>
              </a>
            </div>
          </div>

          {/* Right Column: Live Interactive Product Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
              {/* Preview Header */}
              <div className="border-b border-border bg-muted/60 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">live-preview://cbt-finance</span>
                </div>
                <span className="text-[11px] font-semibold text-primary">Status: Realtime</span>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex border-b border-border bg-card p-1 text-xs">
                <button
                  onClick={() => setActivePreviewTab('invoices')}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${
                    activePreviewTab === 'invoices' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Piutang (AR)
                </button>
                <button
                  onClick={() => setActivePreviewTab('journals')}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${
                    activePreviewTab === 'journals' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Jurnal Otomatis
                </button>
                <button
                  onClick={() => setActivePreviewTab('tax')}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${
                    activePreviewTab === 'tax' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  PPh 23 Bupot
                </button>
              </div>

              {/* Tab Content 1: Invoices */}
              {activePreviewTab === 'invoices' && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border text-xs">
                    <span className="text-muted-foreground">Total Piutang Berjalan:</span>
                    <span className="font-mono font-bold text-foreground tabular-nums">{formatIDR(totalOutstanding)}</span>
                  </div>

                  <div className="space-y-2.5">
                    {invoices.slice(0, 3).map((inv) => {
                      const meta = getInvoiceStatusMeta(inv.status);
                      return (
                        <div key={inv.id} className="p-2.5 rounded-lg border border-border bg-background space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-foreground">{inv.invoice_number}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="truncate max-w-[180px] text-foreground font-medium">{inv.client_name}</span>
                            <span className="font-mono text-foreground font-semibold tabular-nums">{formatIDR(inv.total_amount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                            <span>Jatuh Tempo: {formatDateIndo(inv.due_date)}</span>
                            <span>Sisa: {formatIDR(inv.outstanding_amount)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setViewMode('dashboard')}
                    className="w-full mt-2 py-2 text-center text-xs font-semibold text-primary hover:bg-muted rounded border border-dashed border-border transition-colors"
                  >
                    Buka Kelola Seluruh Invoice →
                  </button>
                </div>
              )}

              {/* Tab Content 2: Journals */}
              {activePreviewTab === 'journals' && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                    <span className="text-muted-foreground">Integritas Neraca:</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Balanced (Debit = Kredit)
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                    {journals.slice(0, 2).map((jv) => (
                      <div key={jv.id} className="p-2.5 rounded-lg border border-border bg-background space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-foreground">{jv.journal_number}</span>
                          <span className="text-[10px] text-muted-foreground">{jv.period}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{jv.description}</p>
                        <div className="text-[11px] font-mono space-y-1 pt-1 border-t border-border">
                          {jv.lines.map((l, i) => (
                            <div key={i} className="flex justify-between text-muted-foreground">
                              <span className={l.debit > 0 ? 'text-foreground font-medium' : 'pl-3 text-muted-foreground'}>
                                {l.account_code} {l.account_name}
                              </span>
                              <span className="tabular-nums">
                                {l.debit > 0 ? formatIDR(l.debit) : formatIDR(l.credit)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setViewMode('dashboard')}
                    className="w-full mt-2 py-2 text-center text-xs font-semibold text-primary hover:bg-muted rounded border border-dashed border-border transition-colors"
                  >
                    Lihat Seluruh Jurnal Transaksi →
                  </button>
                </div>
              )}

              {/* Tab Content 3: Tax */}
              {activePreviewTab === 'tax' && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                    <span className="text-muted-foreground">Tarif Standar PPh 23:</span>
                    <span className="font-bold text-foreground">2% dari DPP (Subtotal)</span>
                  </div>

                  <div className="space-y-2.5">
                    {taxes.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-2.5 rounded-lg border border-border bg-background space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-foreground">{t.invoice_number}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#14324f] text-[#60b0f4] border border-[#1f5080]">
                            {t.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="truncate max-w-[170px] text-foreground">{t.client_name}</span>
                          <span className="font-mono font-semibold text-foreground tabular-nums">{formatIDR(t.tax_amount)}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.evidence_number ? `Bupot: ${t.evidence_number}` : 'Menunggu input bukti potong'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setViewMode('dashboard')}
                    className="w-full mt-2 py-2 text-center text-xs font-semibold text-primary hover:bg-muted rounded border border-dashed border-border transition-colors"
                  >
                    Buka Dashboard Pajak & Bupot →
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
