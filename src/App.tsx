import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessModal } from './components/SuccessModal';
import type { PatientRecord } from './types/registration';
import { patientRegistrationService } from './api/patientRegistration.service';
import { Users, FileCheck, Phone, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'form' | 'success'>('welcome');
  const [lastRecord, setLastRecord] = useState<PatientRecord | null>(null);
  const [registeredPatients, setRegisteredPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vnh_registered_patients');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showRecentDrawer, setShowRecentDrawer] = useState(false);

  // Synchronize recent registrations from backend on mount
  useEffect(() => {
    patientRegistrationService
      .getAllRegistrations(1, 20)
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const mapped: PatientRecord[] = res.data.map((p) => ({
            id: p._id,
            name: p.patientIdentity.name,
            age: String(p.patientIdentity.age),
            gender: p.patientIdentity.gender === 'Female' ? '2. Female' : '1. Male',
            height: String(p.bodyMeasurements.height),
            weight: String(p.bodyMeasurements.weight),
            systolicBP: String(p.bloodPressureVitals.systolic),
            diastolicBP: String(p.bloodPressureVitals.diastolic),
            registrationDate: p.registrationTimestamp.date,
            registrationTime: p.registrationTimestamp.time,
            submittedAt: p.createdAt,
          }));
          setRegisteredPatients(mapped);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch existing patient registrations from backend:', err.message);
      });
  }, []);

  const handleStartRegistration = () => {
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSuccess = (record: PatientRecord) => {
    setLastRecord(record);
    const updated = [record, ...registeredPatients];
    setRegisteredPatients(updated);
    try {
      localStorage.setItem('vnh_registered_patients', JSON.stringify(updated.slice(0, 50)));
    } catch {
      // ignore storage quota issues
    }
    setCurrentPage('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterAnother = () => {
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Clinic Header */}
      <Header onGoHome={handleBackToWelcome} />

      {/* Floating Recent Intake Counter & Toggle */}
      {registeredPatients.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowRecentDrawer(!showRecentDrawer)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-xs transition-colors cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-blue-600" />
            <span>Today's Registrations ({registeredPatients.length})</span>
          </button>
        </div>
      )}

      {/* Recent Registrations Quick Slide-out / Modal */}
      {showRecentDrawer && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Recent Patient Registrations</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRecentDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {registeredPatients.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-700 mr-2">{p.id}</span>
                    <span className="font-semibold text-slate-900">{p.name}</span>
                    <span className="text-slate-500 ml-2">({p.age}y, {p.gender})</span>
                  </div>
                  <div className="text-right text-slate-500 font-mono">
                    <span>BP: {p.systolicBP}/{p.diastolicBP}</span>
                    <span className="mx-2">•</span>
                    <span>{p.registrationTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentPage === 'welcome' && (
          <WelcomeScreen onStartRegistration={handleStartRegistration} />
        )}

        {currentPage === 'form' && (
          <RegistrationForm 
            onBack={handleBackToWelcome} 
            onSubmitSuccess={handleSubmitSuccess} 
          />
        )}

        {currentPage === 'success' && lastRecord && (
          <SuccessModal
            record={lastRecord}
            onRegisterAnother={handleRegisterAnother}
            onGoHome={handleBackToWelcome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <p>© {CURRENT_YEAR} Varma Nursing Home. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
