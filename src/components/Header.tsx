import { Activity, Phone, Clock, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onGoHome?: () => void;
}

export const Header = ({ onGoHome }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="h-7 w-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  VARMA NURSING HOME
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  Clinic Care
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Patient Registration & Clinical Intake System
              </p>
            </div>
          </div>

          {/* Quick Info & Helpdesk */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-50 text-blue-700">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">OPD Timings</p>
                <p className="text-slate-500">08:00 AM – 09:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Emergency Desk</p>
                <p className="text-slate-500">+91 (0) 800-432-1000</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 text-emerald-600 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>NABH Accredited</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
