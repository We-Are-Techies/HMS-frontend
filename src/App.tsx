import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessModal } from './components/SuccessModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import type { BackendPatientRegistrationResponse, Language } from './types/registration';
import type { AdminUser } from './types/admin';
import { adminService } from './api/admin.service';
import { Phone, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'form' | 'success' | 'admin-login' | 'admin-dashboard'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/admin') || hash.includes('admin')) {
      return 'admin-login';
    }
    return 'welcome';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [confirmation, setConfirmation] = useState<{
    record: BackendPatientRegistrationResponse;
    isConsultation: boolean;
  } | null>(null);
  const [registrationLanguage, setRegistrationLanguage] = useState<Language>('en');
  const [resumeExisting, setResumeExisting] = useState(false);

  useEffect(() => {
    localStorage.removeItem('vnh_registered_patients');
  }, []);

  // Check existing admin cookie session on mount
  useEffect(() => {
    adminService
      .getProfile()
      .then((res) => {
        if (res && res.admin) {
          setAdminUser(res.admin);
          const path = window.location.pathname.toLowerCase();
          const hash = window.location.hash.toLowerCase();
          if (path.startsWith('/admin') || hash.includes('admin')) {
            setCurrentPage('admin-dashboard');
          }
        }
      })
      .catch(() => {
        // Not logged in as admin; stay in public mode
        setAdminUser(null);
      });
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash.includes('admin')) {
        setCurrentPage(adminUser ? 'admin-dashboard' : 'admin-login');
      } else {
        setCurrentPage('welcome');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [adminUser]);

  const handleStartRegistration = () => {
    setResumeExisting(false);
    setCurrentPage('form');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSuccess = (record: BackendPatientRegistrationResponse, isConsultation: boolean) => {
    setConfirmation({ record, isConsultation });
    setCurrentPage('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterAnother = () => {
    setResumeExisting(false);
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAdmin = () => {
    setResumeExisting(false);
    if (adminUser) {
      setCurrentPage('admin-dashboard');
      window.history.pushState(null, '', '/admin');
    } else {
      setCurrentPage('admin-login');
      window.history.pushState(null, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    if (resumeExisting) {
      setCurrentPage('form');
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0 });
      return;
    }
    setCurrentPage('admin-dashboard');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setAdminUser(null);
    setCurrentPage('admin-login');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard view and authenticated, render full-screen Admin Dashboard
  if (currentPage === 'admin-dashboard' && adminUser) {
    return (
      <AdminDashboard
        admin={adminUser}
        onLogout={handleLogout}
        onGoToPublicPortal={handleBackToWelcome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Clinic Header */}
      <Header onGoHome={handleBackToWelcome} onGoToAdmin={handleGoToAdmin} />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentPage === 'welcome' && (
          <WelcomeScreen onStartRegistration={handleStartRegistration} />
        )}

        {currentPage === 'form' && (
          <RegistrationForm 
            onBack={handleBackToWelcome} 
            onSubmitSuccess={handleSubmitSuccess}
            language={registrationLanguage}
            onLanguageChange={setRegistrationLanguage}
            staffSignedIn={Boolean(adminUser)}
            startExisting={resumeExisting}
            onStaffLogin={() => {
              handleGoToAdmin();
              setResumeExisting(true);
            }}
          />
        )}

        {currentPage === 'success' && confirmation && (
          <SuccessModal
            {...confirmation}
            onRegisterAnother={handleRegisterAnother}
            onGoHome={handleBackToWelcome}
          />
        )}

        {currentPage === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToPortal={handleBackToWelcome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="font-bold text-slate-900">Varma Nursing Home</span>
            <span>•</span>
            <span>Clinical Inpatient & Outpatient Care</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-blue-600" /> Helpline: +91 800-432-1000
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Certified Medical Facility
            </span>
          </div>

          <div className="flex items-center gap-3">
            <p>© {CURRENT_YEAR} Varma Nursing Home. All rights reserved.</p>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={handleGoToAdmin}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline underline-offset-2"
            >
              Admin Staff Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
