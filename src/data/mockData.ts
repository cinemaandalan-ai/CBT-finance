import { 
  AccountCOA, 
  CostCenter, 
  FiscalPeriod, 
  BankAccount, 
  FinanceInvoice, 
  PaymentReceipt, 
  JournalEntry, 
  WithholdingTax,
  RoleInfo
} from '../types/finance';

export const USER_ROLES: RoleInfo[] = [
  {
    id: 'FINANCE_STAFF',
    name: 'Finance Staff',
    badge: 'Staff',
    description: 'Input pembayaran, buat draft invoice & draft jurnal harian.'
  },
  {
    id: 'FINANCE_MANAGER',
    name: 'Finance Manager',
    badge: 'Manager',
    description: 'Approval invoice, posting jurnal, tutup periode buku.'
  },
  {
    id: 'TAX_ADMIN',
    name: 'Tax Admin',
    badge: 'Pajak',
    description: 'Kelola Faktur Pajak PPN 11%, Bukti Potong PPh 23 & rekonsiliasi.'
  },
  {
    id: 'DIRECTOR',
    name: 'Director / CFO',
    badge: 'Direksi',
    description: 'Eksekutif: Monitoring arus kas, AR aging, persetujuan write-off.'
  },
  {
    id: 'CLIENT_OPERATOR',
    name: 'Client Portal (SMP Cendekia)',
    badge: 'Klien',
    description: 'Akses perwakilan sekolah: Unduh tagihan, upload bukti transfer & bupot.'
  }
];

export const INITIAL_COA: AccountCOA[] = [
  { account_code: '1000', account_name: 'Kas & Bank', account_type: 'ASSET', normal_balance: 'DEBIT', balance: 60620000 },
  { account_code: '1100', account_name: 'Piutang Usaha (AR)', account_type: 'ASSET', normal_balance: 'DEBIT', balance: 87250000 },
  { account_code: '1110', account_name: 'Piutang PPh 23 (Tax Prepayment)', account_type: 'ASSET', normal_balance: 'DEBIT', balance: 1566300 },
  { account_code: '1200', account_name: 'Pendapatan Diterima Dimuka (DP)', account_type: 'LIABILITY', normal_balance: 'CREDIT', balance: 10000000 },
  { account_code: '2100', account_name: 'Hutang PPN (VAT Payable)', account_type: 'LIABILITY', normal_balance: 'CREDIT', balance: 8614650 },
  { account_code: '4000', account_name: 'Pendapatan CBT Sekolah', account_type: 'REVENUE', normal_balance: 'CREDIT', balance: 3315000 },
  { account_code: '4100', account_name: 'Pendapatan CBT Kampus', account_type: 'REVENUE', normal_balance: 'CREDIT', balance: 75000000 },
  { account_code: '4200', account_name: 'Pendapatan Event & Olimpiade', account_type: 'REVENUE', normal_balance: 'CREDIT', balance: 8000000 },
  { account_code: '5000', account_name: 'Beban Server & Cloud Hosting', account_type: 'EXPENSE', normal_balance: 'DEBIT', balance: 8400000 },
  { account_code: '5100', account_name: 'Beban Teknisi Freelance & Onsite', account_type: 'EXPENSE', normal_balance: 'DEBIT', balance: 3750000 }
];

export const INITIAL_COST_CENTERS: CostCenter[] = [
  { code: 'CC-SD', name: 'CBT SD / Madrasah Ibtidaiyah', category: 'School Segment' },
  { code: 'CC-SMP', name: 'CBT SMP / MTs', category: 'School Segment' },
  { code: 'CC-SMA', name: 'CBT SMA / MA / SMK', category: 'School Segment' },
  { code: 'CC-KMP', name: 'CBT Kampus & Perguruan Tinggi', category: 'Campus Segment' },
  { code: 'CC-YYS', name: 'CBT Yayasan Pendidikan Bersama', category: 'Foundation Segment' },
  { code: 'CC-DIK', name: 'CBT Dinas Pendidikan (SPJ Pemda)', category: 'Government Segment' },
  { code: 'CC-OSN', name: 'Event Olimpiade Sains & Tryout Akbar', category: 'Event' }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'BANK-01', bank_name: 'Bank Central Asia (BCA)', account_number: '8210-449-112', account_holder: 'PT CBT Solusi Nusantara', balance: 18520000 },
  { id: 'BANK-02', bank_name: 'Bank Mandiri Giro Usaha', account_number: '137-00-987654-1', account_holder: 'PT CBT Solusi Nusantara', balance: 42100000 }
];

export const INITIAL_PERIODS: FiscalPeriod[] = [
  { id: 'PER-2025-07', name: 'Juli 2025', start_date: '2025-07-01', end_date: '2025-07-31', status: 'CLOSED', closed_by: 'Budi Santoso, SE', closed_at: '2025-08-05' },
  { id: 'PER-2025-08', name: 'Agustus 2025', start_date: '2025-08-01', end_date: '2025-08-31', status: 'CLOSED', closed_by: 'Budi Santoso, SE', closed_at: '2025-09-03' },
  { id: 'PER-2025-09', name: 'September 2025', start_date: '2025-09-01', end_date: '2025-09-30', status: 'OPEN' },
  { id: 'PER-2025-10', name: 'Oktober 2025', start_date: '2025-10-01', end_date: '2025-10-31', status: 'OPEN' }
];

export const INITIAL_INVOICES: FinanceInvoice[] = [
  {
    id: 'INV-001',
    invoice_number: 'INV/2025/0001',
    client_name: 'SMP Cendekia 1',
    client_type: 'SMP/MTS',
    mou_number: 'MOU/2025/001',
    so_number: 'SO/2025/0001',
    do_number: 'DO/2025/0001',
    issue_date: '2025-09-12',
    due_date: '2025-09-26',
    subtotal: 3315000,
    discount: 0,
    tax_base: 3315000,
    vat_rate: 11,
    vat_amount: 364650,
    pph_rate: 2,
    pph_amount: 66300,
    total_amount: 3679650,
    amount_paid: 3613350,
    outstanding_amount: 0,
    status: 'PAID',
    cost_center_code: 'CC-SMP',
    notes: 'Sewa sistem CBT Ujian Tengah Semester (350 siswa x 3 hari)',
    has_journal: true
  },
  {
    id: 'INV-002',
    invoice_number: 'INV/2025/0002',
    client_name: 'OSN Regional Jawa Barat',
    client_type: 'Olimpiade',
    mou_number: null,
    so_number: 'SO/2025/0004',
    do_number: 'DO/2025/0002',
    issue_date: '2025-08-25',
    due_date: '2025-09-24',
    subtotal: 8000000,
    discount: 0,
    tax_base: 8000000,
    vat_rate: 0,
    vat_amount: 0,
    pph_rate: 2,
    pph_amount: 160000,
    total_amount: 8000000,
    amount_paid: 4000000,
    outstanding_amount: 4000000,
    status: 'PARTIALLY_PAID',
    cost_center_code: 'CC-OSN',
    notes: 'Platform Seleksi Olimpiade Sains Regional Jabar Tahap 1 (Bebas PPN)',
    has_journal: true
  },
  {
    id: 'INV-003',
    invoice_number: 'INV/2025/0003',
    client_name: 'Universitas Teknologi Nusantara',
    client_type: 'Kampus',
    mou_number: 'MOU/2025/002',
    so_number: 'SO/2025/0005',
    do_number: 'DO/2025/0004',
    issue_date: '2025-07-01',
    due_date: '2025-07-31',
    subtotal: 75000000,
    discount: 0,
    tax_base: 75000000,
    vat_rate: 11,
    vat_amount: 8250000,
    pph_rate: 2,
    pph_amount: 1500000,
    total_amount: 83250000,
    amount_paid: 0,
    outstanding_amount: 83250000,
    status: 'SENT',
    cost_center_code: 'CC-KMP',
    notes: 'Ujian Mandiri PMB Semester Gasal (Server Dedikasi + 12 Ruang Lab)',
    has_journal: true
  },
  {
    id: 'INV-004',
    invoice_number: 'INV/2025/0004',
    client_name: 'SMA Taruna Bakti',
    client_type: 'SMA/MA/SMK',
    mou_number: 'MOU/2025/004',
    so_number: 'SO/2025/0007',
    do_number: 'DO/2025/0005',
    issue_date: '2025-09-20',
    due_date: '2025-10-04',
    subtotal: 15000000,
    discount: 0,
    tax_base: 15000000,
    vat_rate: 11,
    vat_amount: 1650000,
    pph_rate: 2,
    pph_amount: 300000,
    total_amount: 16650000,
    amount_paid: 0,
    outstanding_amount: 16650000,
    status: 'APPROVED',
    cost_center_code: 'CC-SMA',
    notes: 'Tryout Asesmen Nasional Berbasis Komputer (ANBK 550 Siswa)',
    has_journal: false
  },
  {
    id: 'INV-005',
    invoice_number: 'INV/2025/0005',
    client_name: 'Dinas Pendidikan Kota Bandung',
    client_type: 'Diknas',
    mou_number: 'MOU/2025/006',
    so_number: 'SO/2025/0009',
    do_number: 'DO/2025/0006',
    issue_date: '2025-09-25',
    due_date: '2025-10-25',
    subtotal: 42000000,
    discount: 0,
    tax_base: 42000000,
    vat_rate: 11,
    vat_amount: 4620000,
    pph_rate: 2,
    pph_amount: 840000,
    total_amount: 46620000,
    amount_paid: 0,
    outstanding_amount: 46620000,
    status: 'DRAFT',
    cost_center_code: 'CC-DIK',
    notes: 'Paket Uji Kompetensi Guru (UKG) Se-Kota. Membutuhkan SPJ Billing Package.',
    has_journal: false
  }
];

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: 'PAY-001',
    payment_number: 'PAY/2025/0001',
    client_name: 'SMP Cendekia 1',
    payment_date: '2025-09-20',
    bank_account: 'Bank BCA (8210-449-112)',
    payment_method: 'BANK_TRANSFER',
    amount: 3613350,
    allocated_amount: 3613350,
    unallocated_amount: 0,
    reference_number: 'TRF/BCA/20250920/001',
    status: 'FULLY_ALLOCATED',
    pph_withheld: 66300,
    allocated_invoice_number: 'INV/2025/0001',
    notes: 'Pelunasan invoice INV/2025/0001 net potong PPh 23 2%'
  },
  {
    id: 'PAY-002',
    payment_number: 'PAY/2025/0002',
    client_name: 'OSN Regional Jawa Barat',
    payment_date: '2025-08-28',
    bank_account: 'Bank Mandiri Giro Usaha (137-00-987654-1)',
    payment_method: 'BANK_TRANSFER',
    amount: 4000000,
    allocated_amount: 4000000,
    unallocated_amount: 0,
    reference_number: 'TRF/MANDIRI/20250828/045',
    status: 'FULLY_ALLOCATED',
    pph_withheld: 0,
    allocated_invoice_number: 'INV/2025/0002',
    notes: 'Pembayaran DP 50% untuk event babak penyisihan'
  },
  {
    id: 'PAY-003',
    payment_number: 'PAY/2025/0003',
    client_name: 'Yayasan Bina Insani',
    payment_date: '2025-09-25',
    bank_account: 'Bank BCA (8210-449-112)',
    payment_method: 'BANK_TRANSFER',
    amount: 10000000,
    allocated_amount: 0,
    unallocated_amount: 10000000,
    reference_number: 'TRF/BCA/20250925/882',
    status: 'UNALLOCATED',
    pph_withheld: 0,
    notes: 'Down Payment (DP) sewa server semester ganjil (menunggu SO terbit)'
  }
];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'JV-001',
    journal_number: 'JV/2025/0001',
    journal_date: '2025-09-12',
    period: 'September 2025',
    source_type: 'INVOICE',
    source_reference: 'INV/2025/0001',
    description: 'Posting Piutang Invoice UTS SMP Cendekia 1',
    status: 'POSTED',
    total_debit: 3679650,
    total_credit: 3679650,
    lines: [
      { account_code: '1100', account_name: 'Piutang Usaha (AR)', debit: 3679650, credit: 0, cost_center: 'CC-SMP' },
      { account_code: '4000', account_name: 'Pendapatan CBT Sekolah', debit: 0, credit: 3315000, cost_center: 'CC-SMP' },
      { account_code: '2100', account_name: 'Hutang PPN (VAT Payable)', debit: 0, credit: 364650, cost_center: 'CC-SMP' }
    ]
  },
  {
    id: 'JV-002',
    journal_number: 'JV/2025/0002',
    journal_date: '2025-09-20',
    period: 'September 2025',
    source_type: 'PAYMENT',
    source_reference: 'PAY/2025/0001',
    description: 'Pelunasan INV/2025/0001 SMP Cendekia dengan Potongan PPh 23',
    status: 'POSTED',
    total_debit: 3679650,
    total_credit: 3679650,
    lines: [
      { account_code: '1000', account_name: 'Kas & Bank (BCA)', debit: 3613350, credit: 0 },
      { account_code: '1110', account_name: 'Piutang PPh 23 (Tax Prepayment)', debit: 66300, credit: 0 },
      { account_code: '1100', account_name: 'Piutang Usaha (AR)', debit: 0, credit: 3679650 }
    ]
  },
  {
    id: 'JV-003',
    journal_number: 'JV/2025/0003',
    journal_date: '2025-08-25',
    period: 'Agustus 2025',
    source_type: 'INVOICE',
    source_reference: 'INV/2025/0002',
    description: 'Posting Piutang OSN Regional Jabar (Bebas PPN)',
    status: 'POSTED',
    total_debit: 8000000,
    total_credit: 8000000,
    lines: [
      { account_code: '1100', account_name: 'Piutang Usaha (AR)', debit: 8000000, credit: 0, cost_center: 'CC-OSN' },
      { account_code: '4200', account_name: 'Pendapatan Event & Olimpiade', debit: 0, credit: 8000000, cost_center: 'CC-OSN' }
    ]
  },
  {
    id: 'JV-004',
    journal_number: 'JV/2025/0004',
    journal_date: '2025-08-28',
    period: 'Agustus 2025',
    source_type: 'PAYMENT',
    source_reference: 'PAY/2025/0002',
    description: 'Penerimaan Pembayaran DP 50% OSN Regional Jabar',
    status: 'POSTED',
    total_debit: 4000000,
    total_credit: 4000000,
    lines: [
      { account_code: '1000', account_name: 'Kas & Bank (Mandiri)', debit: 4000000, credit: 0 },
      { account_code: '1100', account_name: 'Piutang Usaha (AR)', debit: 0, credit: 4000000 }
    ]
  },
  {
    id: 'JV-005',
    journal_number: 'JV/2025/0005',
    journal_date: '2025-07-01',
    period: 'Juli 2025',
    source_type: 'INVOICE',
    source_reference: 'INV/2025/0003',
    description: 'Posting Tagihan PMB Universitas Teknologi Nusantara',
    status: 'POSTED',
    total_debit: 83250000,
    total_credit: 83250000,
    lines: [
      { account_code: '1100', account_name: 'Piutang Usaha (AR)', debit: 83250000, credit: 0, cost_center: 'CC-KMP' },
      { account_code: '4100', account_name: 'Pendapatan CBT Kampus', debit: 0, credit: 75000000, cost_center: 'CC-KMP' },
      { account_code: '2100', account_name: 'Hutang PPN (VAT Payable)', debit: 0, credit: 8250000, cost_center: 'CC-KMP' }
    ]
  }
];

export const INITIAL_WITHHOLDING_TAXES: WithholdingTax[] = [
  {
    id: 'WHT-001',
    invoice_number: 'INV/2025/0001',
    payment_number: 'PAY/2025/0001',
    client_name: 'SMP Cendekia 1',
    tax_type: 'PPh 23',
    tax_rate: 2,
    tax_base: 3315000,
    tax_amount: 66300,
    evidence_number: 'BP-23/2025/0089',
    evidence_date: '2025-09-21',
    status: 'VALIDATED',
    file_url: 'Bupot_SMP_Cendekia_0089.pdf'
  },
  {
    id: 'WHT-002',
    invoice_number: 'INV/2025/0002',
    payment_number: 'PAY/2025/0002',
    client_name: 'OSN Regional Jawa Barat',
    tax_type: 'PPh 23',
    tax_rate: 2,
    tax_base: 8000000,
    tax_amount: 160000,
    evidence_number: 'BP-23/2025/0092',
    evidence_date: '2025-09-15',
    status: 'RECEIVED',
    file_url: 'Bupot_OSN_Jabar_0092.pdf'
  },
  {
    id: 'WHT-003',
    invoice_number: 'INV/2025/0003',
    client_name: 'Universitas Teknologi Nusantara',
    tax_type: 'PPh 23',
    tax_rate: 2,
    tax_base: 75000000,
    tax_amount: 1500000,
    status: 'PENDING'
  }
];
