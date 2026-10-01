import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { LandingNav } from './components/layout/LandingNav';
import { LandingFooter } from './components/layout/LandingFooter';
import { HeroSection } from './components/landing/HeroSection';
import { CycleFlowSection } from './components/landing/CycleFlowSection';
import { BentoFeatures } from './components/landing/BentoFeatures';
import { JournalSimulator } from './components/landing/JournalSimulator';
import { SpecComparison } from './components/landing/SpecComparison';

import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { InvoiceList } from './components/dashboard/InvoiceList';
import { PaymentList } from './components/dashboard/PaymentList';
import { TaxManagement } from './components/dashboard/TaxManagement';
import { JournalList } from './components/dashboard/JournalList';
import { GeneralLedgerView } from './components/dashboard/GeneralLedgerView';
import { TrialBalanceView } from './components/dashboard/TrialBalanceView';
import { MasterDataView } from './components/dashboard/MasterDataView';
import { ClientPortalView } from './components/dashboard/ClientPortalView';

import { InvoiceDetailModal } from './components/modals/InvoiceDetailModal';
import { NewPaymentModal } from './components/modals/NewPaymentModal';
import { ManualJournalModal } from './components/modals/ManualJournalModal';
import { ScrollProgressIndicator } from './components/common/ScrollProgressIndicator';
import { FinanceInvoice } from './types/finance';

const AppContent: React.FC = () => {
  const { viewMode, activeTab } = useFinance();
  
  // Dashboard UI states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<FinanceInvoice | null>(null);
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [prefilledInvoiceForPayment, setPrefilledInvoiceForPayment] = useState<string | undefined>(undefined);
  const [isManualJournalModalOpen, setIsManualJournalModalOpen] = useState(false);

  const handleOpenPaymentWithInvoice = (invoiceNumber: string) => {
    setPrefilledInvoiceForPayment(invoiceNumber);
    setIsNewPaymentModalOpen(true);
  };

  const handleOpenGeneralPayment = () => {
    setPrefilledInvoiceForPayment(undefined);
    setIsNewPaymentModalOpen(true);
  };

  // Render Landing Page Mode
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        <ScrollProgressIndicator />
        <LandingNav />
        <main className="flex-1">
          <HeroSection />
          <CycleFlowSection />
          <BentoFeatures />
          <JournalSimulator />
          <SpecComparison />
        </main>
        <LandingFooter />
      </div>
    );
  }

  // Render Admin Dashboard Mode (Sidebar-10 Architecture)
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <ScrollProgressIndicator />
      {/* Sidebar-10 */}
      <AdminSidebar
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenNewPayment={handleOpenGeneralPayment}
          onOpenManualJournal={() => setIsManualJournalModalOpen(true)}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'invoices' && (
            <InvoiceList 
              onSelectInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
              onOpenNewPaymentWithInvoice={handleOpenPaymentWithInvoice}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentList onOpenNewPayment={handleOpenGeneralPayment} />
          )}
          {activeTab === 'tax' && <TaxManagement />}
          {activeTab === 'journals' && (
            <JournalList onOpenManualJournal={() => setIsManualJournalModalOpen(true)} />
          )}
          {activeTab === 'ledger' && <GeneralLedgerView />}
          {activeTab === 'trial_balance' && <TrialBalanceView />}
          {activeTab === 'master' && <MasterDataView />}
          {activeTab === 'client_portal' && <ClientPortalView />}
        </main>
      </div>

      {/* Modals */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForDetail}
        onClose={() => setSelectedInvoiceForDetail(null)}
        onOpenNewPayment={handleOpenPaymentWithInvoice}
      />

      <NewPaymentModal
        isOpen={isNewPaymentModalOpen}
        onClose={() => setIsNewPaymentModalOpen(false)}
        preselectedInvoiceNumber={prefilledInvoiceForPayment}
      />

      <ManualJournalModal
        isOpen={isManualJournalModalOpen}
        onClose={() => setIsManualJournalModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
