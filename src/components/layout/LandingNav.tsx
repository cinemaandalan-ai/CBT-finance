import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';

export const LandingNav: React.FC = () => {
  const { isDark, toggleTheme, setViewMode } = useFinance();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wider">
            CF
          </div>
          <a href="#" className="text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            CBT Finance
          </a>
        </div>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#siklus" className="hover:text-foreground transition-colors">
            Siklus End-to-End
          </a>
          <a href="#fitur" className="hover:text-foreground transition-colors">
            Fitur & Kepatuhan
          </a>
          <a href="#simulator" className="hover:text-foreground transition-colors">
            Simulator Jurnal
          </a>
          <a href="#arsitektur" className="hover:text-foreground transition-colors">
            Spesifikasi Modul
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Ganti Tema"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-foreground" />}
          </button>

          <button
            onClick={() => setViewMode('dashboard')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            <span>Buka Dashboard Admin</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
