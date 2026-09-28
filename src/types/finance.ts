export type UserRole = 
  | 'SUPER_ADMIN'
  | 'FINANCE_STAFF'
  | 'FINANCE_MANAGER'
  | 'TAX_ADMIN'
  | 'DIRECTOR'
  | 'CLIENT_OPERATOR';

export interface RoleInfo {
  id: UserRole;
  name: string;
  badge: string;
  description: string;
}

export interface AccountCOA {
  account_code: string;
  account_name: string;
  account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  normal_balance: 'DEBIT' | 'CREDIT';
  balance: number;
}

export interface CostCenter {
  code: string;
  name: string;
  category: string;
}

export interface FiscalPeriod {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'CLOSED';
  closed_by?: string;
  closed_at?: string;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  balance: number;
}

export type InvoiceStatus = 
  | 'DRAFT'
  | 'APPROVED'
  | 'POSTED'
  | 'SENT'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'ON_HOLD'
  | 'WRITTEN_OFF'
  | 'CANCELLED';

export interface FinanceInvoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_type: 'SD/MI' | 'SMP/MTS' | 'SMA/MA/SMK' | 'Kampus' | 'Yayasan' | 'Diknas' | 'Olimpiade';
  mou_number: string | null;
  so_number: string | null;
  do_number: string | null;
  issue_date: string;
  due_date: string;
  subtotal: number; // DPP
  discount: number;
  tax_base: number;
  vat_rate: number; // usually 11%
  vat_amount: number;
  pph_rate: number; // usually 2%
  pph_amount: number;
  total_amount: number;
  amount_paid: number;
  outstanding_amount: number;
  status: InvoiceStatus;
  cost_center_code: string;
  notes?: string;
  has_journal: boolean;
}

export type PaymentStatus = 'UNALLOCATED' | 'PARTIALLY_ALLOCATED' | 'FULLY_ALLOCATED' | 'VOID';

export interface PaymentReceipt {
  id: string;
  payment_number: string;
  client_name: string;
  payment_date: string;
  bank_account: string;
  payment_method: 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT' | 'QRIS' | 'CASH';
  amount: number;
  allocated_amount: number;
  unallocated_amount: number;
  reference_number: string;
  status: PaymentStatus;
  proof_file_url?: string;
  notes?: string;
  pph_withheld?: number;
  allocated_invoice_number?: string;
}

export type TaxStatus = 'PENDING' | 'RECEIVED' | 'VALIDATED' | 'CREDITED';

export interface WithholdingTax {
  id: string;
  invoice_number: string;
  payment_number?: string;
  client_name: string;
  tax_type: 'PPh 23';
  tax_rate: number;
  tax_base: number;
  tax_amount: number;
  evidence_number?: string;
  evidence_date?: string;
  status: TaxStatus;
  file_url?: string;
}

export interface JournalLine {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  cost_center?: string;
}

export interface JournalEntry {
  id: string;
  journal_number: string;
  journal_date: string;
  period: string;
  source_type: 'INVOICE' | 'PAYMENT' | 'MANUAL' | 'CREDIT_NOTE' | 'WRITE_OFF';
  source_reference: string;
  description: string;
  status: 'DRAFT' | 'POSTED' | 'VOID' | 'REVERSED';
  total_debit: number;
  total_credit: number;
  lines: JournalLine[];
}

export interface GeneralLedgerRecord {
  id: string;
  date: string;
  journal_number: string;
  source: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
