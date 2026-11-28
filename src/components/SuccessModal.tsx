import { CheckCircle2, Home, Printer, UserPlus } from 'lucide-react';
import { formatPatientName, genders } from '../types/registration';
import type { BackendPatientRegistrationResponse } from '../types/registration';

interface SuccessModalProps {
  record: BackendPatientRegistrationResponse;
  isConsultation: boolean;
  onRegisterAnother: () => void;
  onGoHome: () => void;
}

export function SuccessModal({ record, isConsultation, onRegisterAnother, onGoHome }: SuccessModalProps) {
  const t = (english: string, tamil: string) => record.language === 'ta' ? tamil : english;
  const { patientIdentity, registrationTimestamp, bodyMeasurements, bloodPressureVitals } = record;
  const detailItems = [
    [t('Patient name', 'நோயாளியின் பெயர்'), formatPatientName(patientIdentity)],
    [t('Telephone number', 'தொலைபேசி எண்'), patientIdentity.phone],
    [t('Age', 'வயது'), [
      `${patientIdentity.age} ${t('years', 'ஆண்டுகள்')}`,
      patientIdentity.ageMonths == null ? '' : `${patientIdentity.ageMonths} ${t('months', 'மாதங்கள்')}`,
    ].filter(Boolean).join(' ')],
    [t('Gender', 'பாலினம்'), t(patientIdentity.gender, ['ஆண்', 'பெண்', 'திருநர்', 'தெரிவிக்க விரும்பவில்லை'][genders.indexOf(patientIdentity.gender)])],
    [t('Height (cm)', 'உயரம் (செ.மீ.)'), bodyMeasurements?.height],
    [t('Weight (kg)', 'எடை (கிலோ)'), bodyMeasurements?.weight],
    [t('Systolic blood pressure (mmHg)', 'சிஸ்டாலிக் இரத்த அழுத்தம் (mmHg)'), bloodPressureVitals?.systolic],
    [t('Diastolic blood pressure (mmHg)', 'டயஸ்டாலிக் இரத்த அழுத்தம் (mmHg)'), bloodPressureVitals?.diastolic],
  ];

  return (
    <div lang={record.language} className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <section className="bg-white rounded-3xl border border-sky-100 shadow-xl shadow-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 sm:p-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-white/20 backdrop-blur-xs mb-3">
            <CheckCircle2 className="h-10 w-10 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isConsultation
              ? t('Consultation saved', 'ஆலோசனை சேமிக்கப்பட்டது')
              : t('Registration saved', 'பதிவு சேமிக்கப்பட்டது')}
          </h1>
          <p className="text-sm text-teal-100 mt-1">{record.clinicName}</p>
        </div>
        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-end justify-between pb-6 border-b border-slate-200 gap-3">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-500">{t('Patient ID', 'நோயாளி ஐடி')}</p>
              <p className="break-all text-2xl font-mono font-bold text-blue-900 mt-0.5">{record.patientId ?? record._id}</p>
            </div>
            <p className="text-xs text-slate-500 font-mono">{registrationTimestamp.date} · {registrationTimestamp.time}</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {detailItems.filter(([, value]) => value != null).map(([label, value]) => (
              <div key={label} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</dt>
                <dd className="mt-1 break-words font-bold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 print:hidden">
            <button type="button" onClick={onGoHome} className="mr-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50">
              <Home className="h-4 w-4" />{t('Home', 'முகப்பு')}
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100">
              <Printer className="h-4 w-4" />{t('Print slip', 'சீட்டை அச்சிடு')}
            </button>
            <button type="button" onClick={onRegisterAnother} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-600/20">
              <UserPlus className="h-4 w-4" />{t('Register another', 'மற்றொரு பதிவு')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
