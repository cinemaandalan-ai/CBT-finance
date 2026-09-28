import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FinanceInvoice, 
  PaymentReceipt, 
  JournalEntry, 
  WithholdingTax, 
  AccountCOA, 
  FiscalPeriod, 
  CostCenter, 
  BankAccount, 
  UserRole 
} from '../types/finance';
import { 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS, 
  INITIAL_JOURNALS, 
  INITIAL_WITHHOLDING_TAXES, 
  INITIAL_COA, 
  INITIAL_PERIODS, 
  INITIAL_COST_CENTERS, 
  INITIAL_BANK_ACCOUNTS,
  USER_ROLES 
} from '../data/mockData';

export type DashboardTab = 
  | 'overview' 
  | 'invoices' 
  | 'payments' 
  | 'tax' 
  | 'journals' 
  | 'ledger' 
  | 'trial_balance' 
  | 'master' 
  | 'client_portal';

interface FinanceContextType {
  isDark: boolean;
  toggleTheme: () => void;
  viewMode: 'landing' | 'dashboard';
  setViewMode: (mode: 'landing' | 'dashboard') => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Data
  invoices: FinanceInvoice[];
  payments: PaymentReceipt[];
  journals: JournalEntry[];
  taxes: WithholdingTax[];
  coa: AccountCOA[];
  periods: FiscalPeriod[];
  costCenters: CostCenter[];
  bankAccounts: BankAccount[];

  // Actions
  postInvoice: (invoiceId: string) => { success: boolean; message: string };
  recordPayment: (payment: {
    client_name: string;
    amount: number;
    bank_account: string;
    reference_number: string;
    invoice_number?: string;
    pph_withheld?: number;
    notes?: string;
  }) => { success: boolean; message: string };
  addManualJournal: (journal: {
    description: string;
    date: string;
    lines: { account_code: string; debit: number; credit: number; cost_center?: string }[];
  }) => { success: boolean; message: string };
  togglePeriodStatus: (periodId: string) => { success: boolean; message: string };
  validateTaxRecord: (taxId: string, bupotNumber: string) => void;
  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark mode setup
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cbt_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('FINANCE_MANAGER');

  // Business state
  const [invoices, setInvoices] = useState<FinanceInvoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentReceipt[]>(INITIAL_PAYMENTS);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [taxes, setTaxes] = useState<WithholdingTax[]>(INITIAL_WITHHOLDING_TAXES);
  const [coa, setCoa] = useState<AccountCOA[]>(INITIAL_COA);
  const [periods, setPeriods] = useState<FiscalPeriod[]>(INITIAL_PERIODS);
  const [costCenters] = useState<CostCenter[]>(INITIAL_COST_CENTERS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('cbt_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cbt_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Check if active period is closed
  const isDateInClosedPeriod = (dateStr: string): boolean => {
    const closed = periods.find(p => p.status === 'CLOSED' && dateStr >= p.start_date && dateStr <= p.end_date);
    return !!closed;
  };

  // Action: Post Invoice (FIN-INV-006, FIN-BR-011)
  const postInvoice = (invoiceId: string) => {
    const target = invoices.find(inv => inv.id === invoiceId);
    if (!target) return { success: false, message: 'Invoice tidak ditemukan.' };
    if (target.has_journal) return { success: false, message: 'Invoice ini sudah diposting ke Jurnal.' };
    if (isDateInClosedPeriod(target.issue_date)) {
      return { success: false, message: 'Periode transaksi sudah ditutup (Closed Period). Posting ditolak!' };
    }

    const nextJvNum = `JV/2025/000${journals.length + 1}`;
    let revAccount = '4000';
    let revName = 'Pendapatan CBT Sekolah';
    if (target.client_type === 'Kampus') {
      revAccount = '4100';
      revName = 'Pendapatan CBT Kampus';
    } else if (target.client_type === 'Olimpiade') {
      revAccount = '4200';
      revName = 'Pendapatan Event & Olimpiade';
    }

    const lines = [
      {
        account_code: '1100',
        account_name: 'Piutang Usaha (AR)',
        debit: target.total_amount,
        credit: 0,
        cost_center: target.cost_center_code
      },
      {
        account_code: revAccount,
        account_name: revName,
        debit: 0,
        credit: target.tax_base,
        cost_center: target.cost_center_code
      }
    ];

    if (target.vat_amount > 0) {
      lines.push({
        account_code: '2100',
        account_name: 'Hutang PPN (VAT Payable)',
        debit: 0,
        credit: target.vat_amount,
        cost_center: target.cost_center_code
      });
    }

    const newJournal: JournalEntry = {
      id: `JV-${Date.now()}`,
      journal_number: nextJvNum,
      journal_date: target.issue_date,
      period: 'September 2025',
      source_type: 'INVOICE',
      source_reference: target.invoice_number,
      description: `Posting Piutang Invoice ${target.invoice_number} ${target.client_name}`,
      status: 'POSTED',
      total_debit: target.total_amount,
      total_credit: target.total_amount,
      lines
    };

    setJournals(prev => [newJournal, ...prev]);
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? {
      ...inv,
      status: 'SENT',
      has_journal: true
    } : inv));

    // Update COA
    setCoa(prev => prev.map(ac => {
      if (ac.account_code === '1100') return { ...ac, balance: ac.balance + target.total_amount };
      if (ac.account_code === revAccount) return { ...ac, balance: ac.balance + target.tax_base };
      if (ac.account_code === '2100') return { ...ac, balance: ac.balance + target.vat_amount };
      return ac;
    }));

    return { success: true, message: `Invoice ${target.invoice_number} berhasil diposting. Jurnal ${nextJvNum} dibuat seimbang.` };
  };

  // Action: Record Payment (FIN-PAY-009, FIN-ALLOC-001, FIN-BR-012)
  const recordPayment = (payload: {
    client_name: string;
    amount: number;
    bank_account: string;
    reference_number: string;
    invoice_number?: string;
    pph_withheld?: number;
    notes?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    if (isDateInClosedPeriod(today)) {
      return { success: false, message: 'Periode transaksi sudah ditutup. Tidak dapat memposting pembayaran.' };
    }

    const pph = payload.pph_withheld || 0;
    const grossPayment = payload.amount;
    const nextPayNum = `PAY/2025/000${payments.length + 1}`;
    const nextJvNum = `JV/2025/000${journals.length + 1}`;

    let allocatedAmt = 0;
    let invRef = payload.invoice_number;

    if (invRef) {
      const inv = invoices.find(i => i.invoice_number === invRef);
      if (inv) {
        allocatedAmt = grossPayment;
        const totalSettled = grossPayment + pph;
        const newOutstanding = Math.max(0, inv.outstanding_amount - totalSettled);
        const newPaid = inv.amount_paid + totalSettled;
        const newStatus = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';

        setInvoices(prev => prev.map(item => item.id === inv.id ? {
          ...item,
          outstanding_amount: newOutstanding,
          amount_paid: newPaid,
          status: newStatus
        } : item));

        // Create withholding tax record if pph > 0
        if (pph > 0) {
          const newWht: WithholdingTax = {
            id: `WHT-${Date.now()}`,
            invoice_number: inv.invoice_number,
            payment_number: nextPayNum,
            client_name: inv.client_name,
            tax_type: 'PPh 23',
            tax_rate: 2,
            tax_base: inv.subtotal,
            tax_amount: pph,
            status: 'PENDING'
          };
          setTaxes(prev => [newWht, ...prev]);
        }
      }
    }

    const newPayment: PaymentReceipt = {
      id: `PAY-${Date.now()}`,
      payment_number: nextPayNum,
      client_name: payload.client_name,
      payment_date: today,
      bank_account: payload.bank_account,
      payment_method: 'BANK_TRANSFER',
      amount: grossPayment,
      allocated_amount: allocatedAmt,
      unallocated_amount: grossPayment - allocatedAmt,
      reference_number: payload.reference_number,
      status: allocatedAmt === grossPayment ? 'FULLY_ALLOCATED' : allocatedAmt > 0 ? 'PARTIALLY_ALLOCATED' : 'UNALLOCATED',
      pph_withheld: pph,
      allocated_invoice_number: invRef,
      notes: payload.notes
    };

    setPayments(prev => [newPayment, ...prev]);

    // Generate Journal for Payment
    const journalLines = [
      {
        account_code: '1000',
        account_name: 'Kas & Bank',
        debit: grossPayment,
        credit: 0
      }
    ];

    if (pph > 0) {
      journalLines.push({
        account_code: '1110',
        account_name: 'Piutang PPh 23 (Tax Prepayment)',
        debit: pph,
        credit: 0
      });
    }

    if (allocatedAmt > 0) {
      journalLines.push({
        account_code: '1100',
        account_name: 'Piutang Usaha (AR)',
        debit: 0,
        credit: grossPayment + pph
      });
    } else {
      journalLines.push({
        account_code: '1200',
        account_name: 'Pendapatan Diterima Dimuka (DP)',
        debit: 0,
        credit: grossPayment
      });
    }

    const payJournal: JournalEntry = {
      id: `JV-${Date.now()}`,
      journal_number: nextJvNum,
      journal_date: today,
      period: 'September 2025',
      source_type: 'PAYMENT',
      source_reference: nextPayNum,
      description: `Penerimaan Pembayaran ${nextPayNum} dari ${payload.client_name}`,
      status: 'POSTED',
      total_debit: grossPayment + pph,
      total_credit: grossPayment + pph,
      lines: journalLines
    };

    setJournals(prev => [payJournal, ...prev]);

    // Update Bank Account balance
    setBankAccounts(prev => prev.map(b => {
      if (b.bank_name.toLowerCase().includes('bca') && payload.bank_account.includes('BCA')) {
        return { ...b, balance: b.balance + grossPayment };
      }
      if (b.bank_name.toLowerCase().includes('mandiri') && payload.bank_account.includes('Mandiri')) {
        return { ...b, balance: b.balance + grossPayment };
      }
      return b;
    }));

    return { success: true, message: `Pembayaran ${nextPayNum} sebesar Rp ${grossPayment.toLocaleString('id-ID')} berhasil dicatat & dijurnal otomatis.` };
  };

  // Action: Add Manual Journal (FIN-JV-007, FIN-BR-002)
  const addManualJournal = (payload: {
    description: string;
    date: string;
    lines: { account_code: string; debit: number; credit: number; cost_center?: string }[];
  }) => {
    if (isDateInClosedPeriod(payload.date)) {
      return { success: false, message: 'Tanggal jurnal berada pada periode yang telah dikunci (Closed).' };
    }

    const totalDebit = payload.lines.reduce((acc, curr) => acc + (curr.debit || 0), 0);
    const totalCredit = payload.lines.reduce((acc, curr) => acc + (curr.credit || 0), 0);

    if (totalDebit !== totalCredit) {
      return { 
        success: false, 
        message: `Jurnal tidak seimbang! Total Debit (Rp ${totalDebit.toLocaleString('id-ID')}) != Total Kredit (Rp ${totalCredit.toLocaleString('id-ID')}).` 
      };
    }

    const nextJvNum = `JV/2025/000${journals.length + 1}`;
    const formattedLines = payload.lines.map(line => {
      const matched = coa.find(c => c.account_code === line.account_code);
      return {
        account_code: line.account_code,
        account_name: matched ? matched.account_name : 'Akun Keuangan',
        debit: line.debit,
        credit: line.credit,
        cost_center: line.cost_center
      };
    });

    const newJv: JournalEntry = {
      id: `JV-${Date.now()}`,
      journal_number: nextJvNum,
      journal_date: payload.date,
      period: 'September 2025',
      source_type: 'MANUAL',
      source_reference: 'MEMORIAL',
      description: payload.description,
      status: 'POSTED',
      total_debit: totalDebit,
      total_credit: totalCredit,
      lines: formattedLines
    };

    setJournals(prev => [newJv, ...prev]);

    return { success: true, message: `Jurnal Memorial ${nextJvNum} berhasil disimpan dan diposting.` };
  };

  // Action: Toggle Fiscal Period Status (FIN-PER-004)
  const togglePeriodStatus = (periodId: string) => {
    if (currentRole !== 'FINANCE_MANAGER' && currentRole !== 'DIRECTOR' && currentRole !== 'SUPER_ADMIN') {
      return { success: false, message: 'Hanya Finance Manager atau Direktur yang berhak menutup/membuka periode fiskal.' };
    }

    const targetPeriod = periods.find(p => p.id === periodId);
    if (!targetPeriod) return { success: false, message: 'Periode tidak ditemukan.' };

    const updatedStatus: 'OPEN' | 'CLOSED' = targetPeriod.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const updatedName = targetPeriod.name;

    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return {
          ...p,
          status: updatedStatus,
          closed_by: updatedStatus === 'CLOSED' ? 'Manager Keuangan' : undefined,
          closed_at: updatedStatus === 'CLOSED' ? new Date().toISOString() : undefined
        };
      }
      return p;
    }));

    return { 
      success: true, 
      message: `Status Periode ${updatedName} sekarang: ${updatedStatus === 'CLOSED' ? 'DIKUNCI (CLOSED)' : 'DIBUKA (OPEN)'}.` 
    };
  };

  // Action: Validate Bukti Potong PPh 23
  const validateTaxRecord = (taxId: string, bupotNumber: string) => {
    setTaxes(prev => prev.map(t => {
      if (t.id === taxId) {
        return {
          ...t,
          status: 'VALIDATED',
          evidence_number: bupotNumber,
          evidence_date: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const resetDemoData = () => {
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setJournals(INITIAL_JOURNALS);
    setTaxes(INITIAL_WITHHOLDING_TAXES);
    setCoa(INITIAL_COA);
    setPeriods(INITIAL_PERIODS);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
  };

  return (
    <FinanceContext.Provider
      value={{
        isDark,
        toggleTheme,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        invoices,
        payments,
        journals,
        taxes,
        coa,
        periods,
        costCenters,
        bankAccounts,
        postInvoice,
        recordPayment,
        addManualJournal,
        togglePeriodStatus,
        validateTaxRecord,
        resetDemoData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
