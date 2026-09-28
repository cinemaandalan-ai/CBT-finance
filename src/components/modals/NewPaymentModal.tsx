import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedInvoiceNumber?: string;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedInvoiceNumber
}) => {
  const { invoices, recordPayment, bankAccounts } = useFinance();

  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string>(preselectedInvoiceNumber || '');
  const [clientName, setClientName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [pphWithheld, setPphWithheld] = useState<number>(0);
  const [bankAccount, setBankAccount] = useState<string>(
    bankAccounts[0] ? `${bankAccounts[0].bank_name} (${bankAccounts[0].account_number})` : 'Bank BCA'
  );
  const [referenceNumber, setReferenceNumber] = useState<string>(`TRF/BCA/20250928/${Math.floor(100 + Math.random() * 900)}`);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (preselectedInvoiceNumber) {
      setSelectedInvoiceNumber(preselectedInvoiceNumber);
    }
  }, [preselectedInvoiceNumber]);

  useEffect(() => {
    if (selectedInvoiceNumber) {
      const inv = invoices.find(i => i.invoice_number === selectedInvoiceNumber);
      if (inv) {
        setClientName(inv.client_name);
        const estPph = inv.pph_amount || Math.round(inv.subtotal * 0.02);
        setPphWithheld(estPph);
        setAmount(Math.max(0, inv.outstanding_amount - estPph));
        setNotes(`Pelunasan tagihan ${inv.invoice_number} (net setelah potongan PPh 23)`);
      }
    }
  }, [selectedInvoiceNumber, invoices]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Nominal pembayaran harus lebih besar dari 0.');
      return;
    }

    const res = recordPayment({
      client_name: clientName || 'Klien CBT',
      amount,
      bank_account: bankAccount,
      reference_number: referenceNumber,
      invoice_number: selectedInvoiceNumber || undefined,
      pph_withheld: pphWithheld,
      notes
    });

    if (res.success) {
      alert(res.message);
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-5 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Catat Pembayaran Masuk (Bank Receipt)</h3>
              <p className="text-[11px] text-muted-foreground">Otomatisasi Jurnal Bank, Pemotongan PPh 23, dan Alokasi Piutang</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Invoice */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Alokasikan ke Invoice (Piutang AR)</label>
            <select
              value={selectedInvoiceNumber}
              onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Tanpa Alokasi Faktur (Down Payment / DP) --</option>
              {invoices.filter(i => i.outstanding_amount > 0).map(inv => (
                <option key={inv.id} value={inv.invoice_number}>
                  {inv.invoice_number} · {inv.client_name} (Sisa: {formatIDR(inv.outstanding_amount)})
                </option>
              ))}
            </select>
          </div>

          {/* Client Name */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Nama Klien / Pembayar</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Contoh: SMP Cendekia 1"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Bank Destination & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Rekening Kas/Bank Tujuan</label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {bankAccounts.map(b => (
                  <option key={b.id} value={`${b.bank_name} (${b.account_number})`}>
                    {b.bank_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">No. Bukti / Reff Bank</label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Nominal Transfer (Net Bank) & PPh 23 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Nominal Masuk Bank (Net Rp)</label>
              <input
                type="number"
                required
                min="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Potongan PPh 23 (2% Rp)</label>
              <input
                type="number"
                min="0"
                value={pphWithheld}
                onChange={(e) => setPphWithheld(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono font-bold text-[#60b0f4] focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Settlement Preview */}
          <div className="p-3 rounded-lg border border-border bg-muted/30 font-mono text-[11px] space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Debit 1000 Kas & Bank:</span>
              <span className="text-foreground">{formatIDR(amount)}</span>
            </div>
            {pphWithheld > 0 && (
              <div className="flex justify-between text-[#60b0f4]">
                <span>Debit 1110 Piutang PPh 23 (Prepayment):</span>
                <span>{formatIDR(pphWithheld)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
              <span>Kredit 1100 Piutang Usaha Tereliminasi:</span>
              <span>{formatIDR(amount + pphWithheld)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Catatan / Keterangan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pelunasan invoice..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Simpan & Jurnal Otomatis
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
