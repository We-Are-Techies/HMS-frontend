import { CheckCircle2, Printer, UserPlus, Home, Activity } from 'lucide-react';
import type { PatientRecord } from '../types/registration';

interface SuccessModalProps {
  record: PatientRecord;
  onRegisterAnother: () => void;
  onGoHome: () => void;
}

export const SuccessModal = ({ record, onRegisterAnother, onGoHome }: SuccessModalProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-sky-100 shadow-xl shadow-slate-200/60 overflow-hidden">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 sm:p-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-white/20 backdrop-blur-xs mb-3">
            <CheckCircle2 className="h-10 w-10 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Patient Registration Successful!
          </h2>
          <p className="text-sm text-teal-100 mt-1">
            Varma Nursing Home • Registration Slip Generated
          </p>
        </div>

        {/* Printable Registration Slip Content */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Slip Header with ID */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-500">
                Patient Registration Number
              </p>
              <h3 className="text-2xl font-mono font-bold text-blue-900 mt-0.5">
                {record.id}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status: Confirmed & Active
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {record.registrationDate} • {record.registrationTime}
              </p>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Name</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{record.name}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Age & Gender</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {record.age} Years <span className="text-slate-400 font-normal">|</span> {record.gender}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Height & Weight</p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {record.height} cm <span className="text-slate-400 font-normal">|</span> {record.weight} Kg
              </p>
              {record.bmi && (
                <p className="text-xs text-slate-600 mt-1">
                  BMI: <span className="font-semibold">{record.bmi}</span> ({record.bmiCategory})
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Pressure</p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {record.systolicBP} / {record.diastolicBP} <span className="text-xs text-slate-500 font-normal">mmHg</span>
              </p>
              {record.bpCategory && (
                <p className="text-xs text-slate-600 mt-1">
                  Vitals: <span className="font-semibold">{record.bpCategory}</span>
                </p>
              )}
            </div>
          </div>

          {/* Registration Auto-Generated Verification Box */}
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>Registered at Varma Nursing Home OPD Desk</span>
            </div>
            <span className="font-mono text-slate-500">
              Timestamp: {record.registrationDate} {record.registrationTime}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onGoHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={onRegisterAnother}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register Another</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
