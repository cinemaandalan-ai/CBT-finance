import React from 'react';
import { useFinance, DashboardTab } from '../../context/FinanceContext';
import { 
  Menu, 
  Sun, 
  Moon, 
  Plus, 
  Lock, 
  Unlock, 
  FileText, 
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewPayment: () => void;
  onOpenManualJournal: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onOpenNewPayment,
  onOpenManualJournal
}) => {
  const { 
    isDark, 
    toggleTheme, 
    activeTab, 
    periods, 
    currentRole, 
    setViewMode,
    resetDemoData
  } = useFinance();

  const getBreadcrumbTitle = (tab: DashboardTab): { parent: string; current: string } => {
    switch (tab) {
      case 'overview':
        return { parent: 'Dashboard', current: 'Ringkasan Eksekutif' };
      case 'invoices':
        return { parent: 'Operasional', current: 'Invoice & Piutang (AR)' };
      case 'payments':
        return { parent: 'Operasional', current: 'Penerimaan Pembayaran' };
      case 'tax':
        return { parent: 'Pajak & Kepatuhan', current: 'PPh 23 & PPN Keluaran' };
      case 'journals':
        return { parent: 'Pembukuan', current: 'Buku Jurnal Umum' };
      case 'ledger':
        return { parent: 'Pembukuan', current: 'Buku Besar (General Ledger)' };
      case 'trial_balance':
        return { parent: 'Laporan', current: 'Neraca Saldo (Trial Balance)' };
      case 'master':
        return { parent: 'Konfigurasi', current: 'Master Data & COA' };
      case 'client_portal':
        return { parent: 'Portal', current: 'Tampilan Klien (Self-Service)' };
      default:
        return { parent: 'Keuangan', current: 'Dashboard' };
    }
  };

  const breadcrumbs = getBreadcrumbTitle(activeTab);
  const activePeriod = periods.find(p => p.name === 'September 2025') || periods[2];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{breadcrumbs.parent}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">{breadcrumbs.current}</span>
        </div>
      </div>

      {/* Right: Active Period Badge, Actions & Dark Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Active Fiscal Period Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card text-xs">
          <span className="text-muted-foreground">Periode:</span>
          <span className="font-semibold text-foreground">{activePeriod.name}</span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
            activePeriod.status === 'OPEN' 
              ? 'bg-[#0f4c3a] text-[#50e3a6]' 
              : 'bg-[#4a1215] text-[#ff787b]'
          }`}>
            {activePeriod.status === 'OPEN' ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
            {activePeriod.status}
          </span>
        </div>

        {/* Quick Action: New Payment */}
        <button
          onClick={onOpenNewPayment}
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Catat Pembayaran</span>
        </button>

        {/* Quick Action: Manual Journal */}
        <button
          onClick={onOpenManualJournal}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
          <span>Jurnal Manual</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={resetDemoData}
          title="Reset Data Mockup ke Spesifikasi Asli"
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Dark Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Ganti Tema"
          className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4 text-[#5fc5c8]" /> : <Moon className="h-4 w-4 text-foreground" />}
        </button>

        {/* Back to Landing Page */}
        <button
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <span className="hidden sm:inline">Landing Page</span>
          <ExternalLink className="h-3 w-3" />
        </button>

      </div>

    </header>
  );
};
