import { ArrowRight, UserPlus, HeartPulse, ShieldCheck, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStartRegistration: () => void;
}

export const WelcomeScreen = ({ onStartRegistration }: WelcomeScreenProps) => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-50/50 rounded-full blur-2xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Welcome Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* Top Decorative Hospital Ribbon */}
          <div className="h-2.5 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400" />

          <div className="p-8 sm:p-12 lg:p-16 text-center max-w-3xl mx-auto">
            {/* Hospital Emblem & Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-6 shadow-xs">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span>Varma Nursing Home • Digital Clinic Portal</span>
            </div>

            {/* Main Headings */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">Varma Nursing Home</span>
            </h1>

            <p className="mt-4 text-lg sm:text-xl font-medium text-slate-600">
              Patient Registration System
            </p>

            <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Please initiate new patient clinical registration. Complete patient identity,
              demographics, and vital signs including blood pressure, height, and weight for OPD consultation.
            </p>

            {/* Prominent Next / Start Registration Button */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onStartRegistration}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <UserPlus className="h-5 w-5" />
                <span>Next – Register Patient</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Checklist / Reassurance */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Vitals Recording
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automatic Timestamping
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified Clinical Intake
              </span>
            </div>
          </div>

          {/* Features Grid inside Card footer */}
          <div className="bg-slate-50/80 border-t border-sky-100 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-slate-900">Vitals & BP Tracking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Records Systolic & Diastolic readings with automatic standard verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-slate-900">Digital Patient Sheet</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Follows Varma Nursing Home standardized clinic registration format.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-slate-900">Patient Confidentiality</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compliant clinical records intake with audit timestamping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

