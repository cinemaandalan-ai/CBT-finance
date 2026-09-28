import React, { useState } from 'react';
import { useFinance, DashboardTab } from '../../context/FinanceContext';
import { USER_ROLES } from '../../data/mockData';
import { UserRole } from '../../types/finance';
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  Percent, 
  BookOpen, 
  Layers, 
  Scale, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  Building2,
  Search,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpenMobile, setIsOpenMobile }) => {
  const { activeTab, setActiveTab, currentRole, setCurrentRole, setViewMode } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navGroups: {
    title: string;
    items: {
      id: DashboardTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[];
  }[] = [
    {
      title: 'OPERASIONAL KEUANGAN',
      items: [
        { id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
        { id: 'invoices', label: 'Invoice & Piutang (AR)', icon: Receipt, badge: '5' },
        { id: 'payments', label: 'Penerimaan Pembayaran', icon: CreditCard, badge: '3' }
      ]
    },
    {
      title: 'PERPAJAKAN & PEMBUKUAN',
      items: [
        { id: 'tax', label: 'PPh 23 & PPN Keluaran', icon: Percent },
        { id: 'journals', label: 'Buku Jurnal Transaksi', icon: BookOpen },
        { id: 'ledger', label: 'Buku Besar (GL)', icon: Layers },
        { id: 'trial_balance', label: 'Neraca Saldo (TB)', icon: Scale }
      ]
    },
    {
      title: 'KONFIGURASI & AKSES',
      items: [
        { id: 'master', label: 'Master Data & COA', icon: Sliders },
        { id: 'client_portal', label: 'Portal Klien (Self-Service)', icon: ExternalLink, badge: 'Preview' }
      ]
    }
  ];

  const currentRoleInfo = USER_ROLES.find(r => r.id === currentRole) || USER_ROLES[0];

  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar-10 container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-border bg-sidebar flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Header / Org Switcher (Sidebar-10 Style) */}
          <div className="border-b border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
                  CF
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xs font-bold text-sidebar-foreground truncate tracking-tight">
                    PT CBT Solusi Nusantara
                  </h2>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Finance & Accounting Suite
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Cari transaksi / akun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-sidebar-border bg-card px-2.5 py-1.5 pl-8 text-xs text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-5">
            {navGroups.map((group) => {
              const filteredItems = group.items.filter(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.title} className="space-y-1">
                  <div className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </div>
                  {filteredItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Section: Role Switcher & User Profile (Sidebar-10 Style) */}
        <div className="border-t border-sidebar-border p-3 bg-sidebar">
          
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg border border-sidebar-border bg-card hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-xs text-primary">
                  {currentRoleInfo.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {currentRoleInfo.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate block">
                    Role: {currentRoleInfo.badge}
                  </span>
                </div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Role Switcher Menu */}
            {roleDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-border bg-card shadow-lg p-1.5 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase">
                  Pilih Role Demonstrasi RBAC:
                </div>
                {USER_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role.id);
                      setRoleDropdownOpen(false);
                      if (role.id === 'CLIENT_OPERATOR') {
                        setActiveTab('client_portal');
                      }
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between ${
                      currentRole === role.id ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{role.name}</span>
                    <span className="text-[10px] opacity-75">{role.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Exit to Landing Page */}
          <button
            onClick={() => setViewMode('landing')}
            className="w-full mt-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Kembali ke Halaman Produk
          </button>
        </div>

      </aside>
    </>
  );
};
