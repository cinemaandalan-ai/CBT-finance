import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowRight } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const { setViewMode } = useFinance();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                CF
              </div>
              <span className="text-sm font-bold text-foreground">CBT Finance & Accounting Module</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              Modul keuangan khusus bisnis persewaan dan pelaksanaan ujian berbasis komputer (Computer Based Test).
              Menggantikan sistem warisan SIS dengan pelacakan invoice, rekonsiliasi PPh 23, jurnal berpasangan otomatis, dan buku besar akrual.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setViewMode('dashboard')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                <span>Masuk ke Simulator & Console Admin</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Cakupan Modul</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Billing & AR Aging</li>
              <li>Rekonsiliasi PPh 23 & PPN</li>
              <li>Auto Journal Posting</li>
              <li>General Ledger & Trial Balance</li>
              <li>Client Self-Service Portal</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Kepatuhan Regulasi</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>PPN 11% Faktur Pajak Standar</li>
              <li>Withholding PPh 23 (Tarif 2%)</li>
              <li>Standar Akuntansi Keuangan (SAK)</li>
              <li>Audit Trail Terkunci per Periode</li>
              <li>Format SPJ Instansi Pendidikan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2025–2026 PT CBT Solusi Nusantara. Dokumen Spesifikasi CBT-Finance-Module-Spec v1.0.</p>
          <div className="flex items-center gap-4">
            <span className="text-foreground font-medium">Beban Akuntansi Seimbang 100%</span>
            <span>·</span>
            <span>IDR Mata Uang Domestik</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
