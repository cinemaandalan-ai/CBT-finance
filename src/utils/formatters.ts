export function formatIDR(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return 'Rp 0';
  return 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return `${day} ${months[monthIndex] || parts[1]} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function getInvoiceStatusMeta(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'PAID':
      return { label: 'Lunas (Paid)', bg: 'bg-[#0f4c3a]', text: 'text-[#50e3a6]', border: 'border-[#1b7359]' };
    case 'PARTIALLY_PAID':
      return { label: 'Sebagian (Partial)', bg: 'bg-[#402e08]', text: 'text-[#f5c042]', border: 'border-[#715312]' };
    case 'SENT':
      return { label: 'Terkirim (Sent)', bg: 'bg-[#14324f]', text: 'text-[#60b0f4]', border: 'border-[#1f5080]' };
    case 'APPROVED':
      return { label: 'Disetujui (Approved)', bg: 'bg-[#153e40]', text: 'text-[#5fc5c8]', border: 'border-[#2a5e60]' };
    case 'DRAFT':
      return { label: 'Draft', bg: 'bg-[#2b2b2b]', text: 'text-[#d4d4d4]', border: 'border-[#404040]' };
    case 'OVERDUE':
      return { label: 'Jatuh Tempo (Overdue)', bg: 'bg-[#4a1215]', text: 'text-[#ff787b]', border: 'border-[#7a1c22]' };
    default:
      return { label: status, bg: 'bg-[#262626]', text: 'text-[#e5e5e5]', border: 'border-[#404040]' };
  }
}

export function getPaymentStatusMeta(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'FULLY_ALLOCATED':
      return { label: 'Teralokasi Penuh', bg: 'bg-[#0f4c3a]', text: 'text-[#50e3a6]', border: 'border-[#1b7359]' };
    case 'PARTIALLY_ALLOCATED':
      return { label: 'Alokasi Sebagian', bg: 'bg-[#402e08]', text: 'text-[#f5c042]', border: 'border-[#715312]' };
    case 'UNALLOCATED':
      return { label: 'Belum Teralokasi (DP)', bg: 'bg-[#14324f]', text: 'text-[#60b0f4]', border: 'border-[#1f5080]' };
    case 'VOID':
      return { label: 'Dibatalkan (Void)', bg: 'bg-[#4a1215]', text: 'text-[#ff787b]', border: 'border-[#7a1c22]' };
    default:
      return { label: status, bg: 'bg-[#262626]', text: 'text-[#e5e5e5]', border: 'border-[#404040]' };
  }
}

export function getTaxStatusMeta(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'VALIDATED':
      return { label: 'Tervalidasi DJP', bg: 'bg-[#0f4c3a]', text: 'text-[#50e3a6]', border: 'border-[#1b7359]' };
    case 'RECEIVED':
      return { label: 'Diterima dari Klien', bg: 'bg-[#14324f]', text: 'text-[#60b0f4]', border: 'border-[#1f5080]' };
    case 'PENDING':
      return { label: 'Menunggu Bupot', bg: 'bg-[#402e08]', text: 'text-[#f5c042]', border: 'border-[#715312]' };
    case 'CREDITED':
      return { label: 'Sudah Dikreditkan', bg: 'bg-[#2b1f4a]', text: 'text-[#c084fc]', border: 'border-[#4c2882]' };
    default:
      return { label: status, bg: 'bg-[#262626]', text: 'text-[#e5e5e5]', border: 'border-[#404040]' };
  }
}
