import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { AddProblemModal } from '../../modals/AddProblemModal';
import { ReviewModal } from '../../modals/ReviewModal';
import { GlobalSearchModal } from '../../modals/GlobalSearchModal';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background-alt text-text-main font-sans">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals and Toasts */}
      <AddProblemModal />
      <ReviewModal />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
