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
      return { 
        label: 'Lunas (Paid)', 
        bg: 'bg-[#edf8ed] dark:bg-[#112d14]', 
        text: 'text-[#2b722d] dark:text-[#78cf77]', 
        border: 'border-[#bde3bd] dark:border-[#1e4e22]' 
      };
    case 'PARTIALLY_PAID':
      return { 
        label: 'Sebagian (Partial)', 
        bg: 'bg-[#fef9ec] dark:bg-[#332608]', 
        text: 'text-[#b45309] dark:text-[#fbbf24]', 
        border: 'border-[#fde68a] dark:border-[#63480f]' 
      };
    case 'SENT':
      return { 
        label: 'Terkirim (Sent)', 
        bg: 'bg-[#eff6ff] dark:bg-[#132742]', 
        text: 'text-[#1d4ed8] dark:text-[#60a5fa]', 
        border: 'border-[#bfdbfe] dark:border-[#1e3a66]' 
      };
    case 'APPROVED':
      return { 
        label: 'Disetujui (Approved)', 
        bg: 'bg-[#f0f9f0] dark:bg-[#16361a]', 
        text: 'text-[#3d883c] dark:text-[#88d987]', 
        border: 'border-[#c5eac4] dark:border-[#245228]' 
      };
    case 'DRAFT':
      return { 
        label: 'Draft', 
        bg: 'bg-[#f5f5f5] dark:bg-[#242424]', 
        text: 'text-[#525252] dark:text-[#d4d4d4]', 
        border: 'border-[#e5e5e5] dark:border-[#383838]' 
      };
    case 'OVERDUE':
      return { 
        label: 'Jatuh Tempo (Overdue)', 
        bg: 'bg-[#fef2f2] dark:bg-[#3f1216]', 
        text: 'text-[#b91c1c] dark:text-[#f87171]', 
        border: 'border-[#fecaca] dark:border-[#6e1e24]' 
      };
    default:
      return { 
        label: status, 
        bg: 'bg-muted', 
        text: 'text-foreground', 
        border: 'border-border' 
      };
  }
}

export function getPaymentStatusMeta(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'FULLY_ALLOCATED':
      return { 
        label: 'Teralokasi Penuh', 
        bg: 'bg-[#edf8ed] dark:bg-[#112d14]', 
        text: 'text-[#2b722d] dark:text-[#78cf77]', 
        border: 'border-[#bde3bd] dark:border-[#1e4e22]' 
      };
    case 'PARTIALLY_ALLOCATED':
      return { 
        label: 'Alokasi Sebagian', 
        bg: 'bg-[#fef9ec] dark:bg-[#332608]', 
        text: 'text-[#b45309] dark:text-[#fbbf24]', 
        border: 'border-[#fde68a] dark:border-[#63480f]' 
      };
    case 'UNALLOCATED':
      return { 
        label: 'Belum Teralokasi (DP)', 
        bg: 'bg-[#eff6ff] dark:bg-[#132742]', 
        text: 'text-[#1d4ed8] dark:text-[#60a5fa]', 
        border: 'border-[#bfdbfe] dark:border-[#1e3a66]' 
      };
    case 'VOID':
      return { 
        label: 'Dibatalkan (Void)', 
        bg: 'bg-[#fef2f2] dark:bg-[#3f1216]', 
        text: 'text-[#b91c1c] dark:text-[#f87171]', 
        border: 'border-[#fecaca] dark:border-[#6e1e24]' 
      };
    default:
      return { 
        label: status, 
        bg: 'bg-muted', 
        text: 'text-foreground', 
        border: 'border-border' 
      };
  }
}

export function getTaxStatusMeta(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'VALIDATED':
      return { 
        label: 'Tervalidasi DJP', 
        bg: 'bg-[#edf8ed] dark:bg-[#112d14]', 
        text: 'text-[#2b722d] dark:text-[#78cf77]', 
        border: 'border-[#bde3bd] dark:border-[#1e4e22]' 
      };
    case 'RECEIVED':
      return { 
        label: 'Diterima dari Klien', 
        bg: 'bg-[#eff6ff] dark:bg-[#132742]', 
        text: 'text-[#1d4ed8] dark:text-[#60a5fa]', 
        border: 'border-[#bfdbfe] dark:border-[#1e3a66]' 
      };
    case 'PENDING':
      return { 
        label: 'Menunggu Bupot', 
        bg: 'bg-[#fef9ec] dark:bg-[#332608]', 
        text: 'text-[#b45309] dark:text-[#fbbf24]', 
        border: 'border-[#fde68a] dark:border-[#63480f]' 
      };
    case 'CREDITED':
      return { 
        label: 'Sudah Dikreditkan', 
        bg: 'bg-[#faf5ff] dark:bg-[#25173e]', 
        text: 'text-[#7e22ce] dark:text-[#c084fc]', 
        border: 'border-[#e9d5ff] dark:border-[#4d257e]' 
      };
    default:
      return { 
        label: status, 
        bg: 'bg-muted', 
        text: 'text-foreground', 
        border: 'border-border' 
      };
  }
}
