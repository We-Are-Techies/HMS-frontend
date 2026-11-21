import React from 'react';
import { 
  X, 
  Printer, 
  User, 
  Heart, 
  Activity, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import type { BackendPatientRegistrationResponse } from '../../types/registration';

interface PatientDetailModalProps {
  patient: BackendPatientRegistrationResponse | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!patient) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate BMI
  const heightInMeters = patient.bodyMeasurements.height / 100;
  const bmi = (patient.bodyMeasurements.weight / (heightInMeters * heightInMeters)).toFixed(1);
  const bmiNum = parseFloat(bmi);
  let bmiCategory = 'Normal weight';
  let bmiBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight';
    bmiBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Overweight';
    bmiBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (bmiNum >= 30) {
    bmiCategory = 'Obese';
    bmiBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  // BP Clinical Category
  const sys = patient.bloodPressureVitals.systolic;
  const dia = patient.bloodPressureVitals.diastolic;
  let bpCategory = 'Normal Blood Pressure';
  let bpBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (sys >= 140 || dia >= 90) {
    bpCategory = 'Stage 2 Hypertension';
    bpBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    bpCategory = 'Stage 1 Hypertension';
    bpBadgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (sys >= 120 && sys <= 129 && dia < 80) {
    bpCategory = 'Elevated Blood Pressure';
    bpBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-sky-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Patient Clinical Intake Record</h3>
              <p className="text-xs text-sky-200 font-mono">Varma Nursing Home • Registration Summary</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Patient Primary Banner */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{patient.patientIdentity.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-600 font-medium">{patient.patientIdentity.age} Years Old</span>
                  <span className="text-slate-300">•</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${
                    patient.patientIdentity.gender === 'Female' 
                      ? 'bg-pink-50 text-pink-700 border-pink-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {patient.patientIdentity.gender}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Registration ID</span>
                <span className="text-xs font-mono font-bold text-slate-700">{patient._id}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy ID"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Vitals & Measurements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Pressure Card */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Blood Pressure</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${bpBadgeClass}`}>
                  {bpCategory}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {sys}/{dia}
                </span>
                <span className="text-xs text-slate-500 font-medium">mmHg</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Systolic: <strong className="text-slate-700">{sys} mmHg</strong> • Diastolic: <strong className="text-slate-700">{dia} mmHg</strong>
              </p>
            </div>

            {/* Body Measurements & BMI Card */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Body Measurements</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${bmiBadgeClass}`}>
                  BMI: {bmi} ({bmiCategory})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Height</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{patient.bodyMeasurements.height}</span>
                  <span className="text-xs text-slate-500 ml-1">cm</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{patient.bodyMeasurements.weight}</span>
                  <span className="text-xs text-slate-500 ml-1">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps & Audit Log */}
          <div className="rounded-2xl bg-sky-50/50 border border-sky-100 p-4 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Registration Date: <strong className="text-slate-800">{patient.registrationTimestamp?.date}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Registration Time: <strong className="text-slate-800">{patient.registrationTimestamp?.time}</strong></span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2 text-[11px] text-slate-400 pt-2 border-t border-sky-100">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Document Created: {new Date(patient.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Intake Record</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
