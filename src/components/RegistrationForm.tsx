import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Activity, ArrowLeft, HeartPulse, Ruler, ShieldCheck, User } from 'lucide-react';
import { formatPatientName, genders, patientTitles } from '../types/registration';
import type { BackendPatientRegistrationResponse, Gender, Language, PatientMatch, PatientTitle } from '../types/registration';
import { patientRegistrationService } from '../api/patientRegistration.service';

interface RegistrationFormProps {
  onBack: () => void;
  onSubmitSuccess: (record: BackendPatientRegistrationResponse, isConsultation: boolean) => void;
  staffSignedIn: boolean;
  onStaffLogin: () => void;
  startExisting: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const initialFields = {
  name: '', title: '' as PatientTitle | '', phone: '', age: '', ageMonths: '', gender: '',
  weight: '', height: '', systolic: '', diastolic: '',
};

const inputs = [
  { key: 'phone', label: 'Telephone number', tamil: 'தொலைபேசி எண்', type: 'tel', required: true, maxLength: 26, autoComplete: 'tel' },
  { key: 'age', label: 'Age (years)', tamil: 'வயது (ஆண்டுகள்)', type: 'number', required: true, min: 0, max: 120 },
  { key: 'ageMonths', label: 'Age (months)', tamil: 'வயது (மாதங்கள்)', type: 'number', min: 0, max: 11 },
  { key: 'weight', label: 'Weight (kg)', tamil: 'எடை (கிலோ)', type: 'number', min: 0.1, max: 150, step: 0.1 },
  { key: 'height', label: 'Height (cm)', tamil: 'உயரம் (செ.மீ.)', type: 'number', min: 0, max: 220 },
  { key: 'systolic', label: 'Systolic blood pressure (mmHg)', tamil: 'சிஸ்டாலிக் இரத்த அழுத்தம் (mmHg)', type: 'number', min: 60, max: 260 },
  { key: 'diastolic', label: 'Diastolic blood pressure (mmHg)', tamil: 'டயஸ்டாலிக் இரத்த அழுத்தம் (mmHg)', type: 'number', min: 40, max: 160 },
] as const;

const fieldClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white transition-all hover:border-slate-400 focus:outline-none focus:ring-2 focus:border-blue-600 focus:ring-blue-100';
const buttonClass = 'rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-800 disabled:opacity-50';
const headingClass = 'flex items-center gap-2 border-b border-slate-200 pb-3 mb-2 font-bold uppercase tracking-wide text-slate-900 sm:col-span-2';
const optionalNumber = (value: string) => value === '' ? undefined : Number(value);

export function RegistrationForm({ onBack, onSubmitSuccess, staffSignedIn, onStaffLogin, startExisting, language, onLanguageChange }: RegistrationFormProps) {
  const [mode, setMode] = useState(startExisting ? 'existing' : 'new');
  const [clinicName, setClinicName] = useState('Varma Nursing Home');
  const [fields, setFields] = useState(initialFields);
  const [identifier, setIdentifier] = useState('');
  const [matches, setMatches] = useState<PatientMatch[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const search = useRef<AbortController | null>(null);
  const t = (english: string, tamil: string) => language === 'ta' ? tamil : english;

  useEffect(() => () => search.current?.abort(), []);

  const clearPatient = () => {
    search.current?.abort();
    setSearching(false);
    setMatches([]);
    setSelectedId('');
    setFields(initialFields);
    setError('');
  };

  const selectPatient = ({ patientId, patientIdentity }: PatientMatch) => {
    setSelectedId(String(patientId));
    setFields({
      ...initialFields,
      name: patientIdentity.name,
      title: patientIdentity.title ?? '',
      phone: patientIdentity.phone ?? '',
      age: String(patientIdentity.age),
      ageMonths: String(patientIdentity.ageMonths ?? ''),
      gender: patientIdentity.gender,
    });
  };

  const findPatient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearPatient();
    const request = new AbortController();
    search.current = request;
    setSearching(true);
    try {
      const found = await patientRegistrationService.lookup(identifier.trim(), request.signal);
      if (request.signal.aborted) return;
      setMatches(found);
      if (found.length === 1) selectPatient(found[0]);
      if (!found.length) setError(t('No matching patient found.', 'பொருந்தும் நோயாளி கிடைக்கவில்லை.'));
    } catch (failure) {
      if (!request.signal.aborted) setError(language === 'en' && failure instanceof Error ? failure.message : 'நோயாளியைத் தேட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      if (!request.signal.aborted) setSearching(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || (mode === 'existing' && !selectedId)) return;
    setError('');
    const phoneDigits = fields.phone.replace(/[^0-9]/g, '');
    if (!/^\+?[0-9][0-9 ().-]{5,24}$/.test(fields.phone.trim()) || !/^\d{7,15}$/.test(phoneDigits) || clinicName.trim() === '' || fields.name.trim().length < 2) {
      setError(t('Check the clinic name, patient name and telephone number.', 'மருத்துவமனை பெயர், நோயாளி பெயர் மற்றும் தொலைபேசி எண்ணைச் சரிபார்க்கவும்.'));
      return;
    }
    setSubmitting(true);
    try {
      const record = await patientRegistrationService.createRegistration({
        clinicName: clinicName.trim(),
        language,
        patientIdentity: {
          name: fields.name.trim(), phone: fields.phone.trim(), age: Number(fields.age),
          title: fields.title || undefined,
          ageMonths: optionalNumber(fields.ageMonths), gender: fields.gender as Gender,
        },
        bodyMeasurements: { weight: optionalNumber(fields.weight), height: optionalNumber(fields.height) },
        bloodPressureVitals: { systolic: optionalNumber(fields.systolic), diastolic: optionalNumber(fields.diastolic) },
      }, selectedId || undefined);
      onSubmitSuccess(record, mode === 'existing');
    } catch (failure) {
      setError(language === 'en' && failure instanceof Error ? failure.message : 'பதிவைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setSubmitting(false);
    }
  };

  const heightInMetres = Number(fields.height) / 100;
  const weightInKg = Number(fields.weight);
  const bmi = heightInMetres > 0 && heightInMetres <= 2.2 && weightInKg >= 0.1 && weightInKg <= 150
    ? (weightInKg / heightInMetres ** 2).toFixed(1)
    : undefined;

  return (
    <div lang={language} className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button type="button" onClick={onBack} disabled={submitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 shadow-xs transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />{t('Back to Welcome', 'முகப்புக்குத் திரும்பு')}
        </button>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-sky-50/80 px-3 py-1.5 rounded-full border border-sky-100">
          <ShieldCheck className="h-4 w-4 text-blue-600" />{t('Official Registration Form', 'அதிகாரப்பூர்வ பதிவு படிவம்')}
        </div>
      </div>
      <section className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border-b border-blue-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                {clinicName || 'Varma Nursing Home'} · {t('Clinic OPD Intake', 'வெளிநோயாளர் பதிவு')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {t('CLINIC PATIENT REGISTRATION', 'மருத்துவமனை நோயாளி பதிவு')}
              </h1>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-blue-900/60 border border-blue-700/50 text-xs text-sky-200">
              <Activity className="h-4 w-4 text-sky-400" />{t('Live Patient Intake', 'நோயாளி சேர்க்கை')}
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>{t('Language', 'மொழி')}
              <select className={fieldClass} value={language} disabled={submitting || searching} onChange={event => { onLanguageChange(event.target.value as Language); setError(''); }}>
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </label>
            <label>{t('Registration', 'பதிவு வகை')}
              <select className={fieldClass} value={mode} disabled={submitting} onChange={event => {
                clearPatient();
                setIdentifier('');
                setMode(event.target.value);
              }}>
                <option value="new">{t('New patient', 'புதிய நோயாளி')}</option>
                <option value="existing">{t('Existing patient', 'ஏற்கனவே பதிவு செய்த நோயாளி')}</option>
              </select>
            </label>
          </div>

          {mode === 'new' && <p className="text-sm text-slate-600">{t('A patient ID is assigned when you save.', 'சேமிக்கும்போது நோயாளி ஐடி உருவாக்கப்படும்.')}</p>}

          {mode === 'existing' && (staffSignedIn ? (
            <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <form onSubmit={findPatient} className="flex flex-wrap items-end gap-3">
                <label className="min-w-48 flex-1">{t('Patient ID or telephone number', 'நோயாளி ஐடி அல்லது தொலைபேசி எண்')}
                  <input className={fieldClass} value={identifier} required maxLength={40} disabled={submitting}
                    onChange={event => { clearPatient(); setIdentifier(event.target.value); }} />
                </label>
                <button className={buttonClass} disabled={submitting || searching || !identifier.trim()}>
                  {searching ? t('Searching…', 'தேடுகிறது…') : t('Find patient', 'நோயாளியைத் தேடு')}
                </button>
              </form>
              {matches.length > 1 && (
                <label>{t('This telephone number is shared. Select the patient.', 'இந்தத் தொலைபேசி எண் பகிரப்பட்டுள்ளது. நோயாளியைத் தேர்ந்தெடுக்கவும்.')}
                  <select className={fieldClass} value={selectedId} disabled={submitting} onChange={event => {
                    const patient = matches.find(match => String(match.patientId) === event.target.value);
                    if (patient) selectPatient(patient);
                    else { setSelectedId(''); setFields(initialFields); }
                  }}>
                    <option value="">{t('Select a patient', 'நோயாளியைத் தேர்ந்தெடு')}</option>
                    {matches.map(match => <option key={match.patientId} value={match.patientId}>
                      {formatPatientName(match.patientIdentity)} · {match.patientIdentity.age} {t('yr', 'ஆண்டு')} · {match.patientId}
                    </option>)}
                  </select>
                </label>
              )}
              {selectedId && <p className="break-all text-sm">{t('Patient ID', 'நோயாளி ஐடி')} · {selectedId}</p>}
            </div>
          ) : (
            <button type="button" className={buttonClass} onClick={onStaffLogin}>{t('Staff sign-in to find a patient', 'நோயாளியைத் தேட பணியாளர் உள்நுழைவு')}</button>
          ))}

          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
          {(mode === 'new' || selectedId) && (
            <form onSubmit={submit} className="space-y-5">
              <fieldset disabled={submitting} className="grid gap-4 sm:grid-cols-2">
                <h2 className={headingClass}>
                  <User className="h-8 w-8 rounded-md bg-blue-50 p-1.5 text-blue-700" />
                  {t('Patient Identity & Demographics', 'நோயாளியின் விவரங்கள்')}
                </h2>
                <label className="sm:col-span-2">{t('Clinic name', 'மருத்துவமனையின் பெயர்')}
                  <input className={fieldClass} required maxLength={120} value={clinicName} onChange={event => setClinicName(event.target.value)} />
                </label>
                <div>
                  <label htmlFor="patient-name">{t('Patient name', 'நோயாளியின் பெயர்')}</label>
                  <div className="flex gap-2">
                    <div className="flex-none">
                      <select className={fieldClass} aria-label={t('Patient title', 'நோயாளியின் பட்டம்')}
                        value={fields.title} onChange={event => setFields(previous => ({ ...previous, title: event.target.value as PatientTitle | '' }))}>
                        <option value="">{t('Title', 'பட்டம்')}</option>
                        {patientTitles.map(title => <option key={title} value={title}>{title}</option>)}
                      </select>
                    </div>
                    <input id="patient-name" className={`${fieldClass} min-w-0`} type="text" autoComplete="name" required minLength={2} maxLength={100}
                      placeholder={t('e.g. A. B. Kumar', 'எ.கா. அ. ப. குமார்')} value={fields.name}
                      onChange={event => setFields(previous => ({ ...previous, name: event.target.value }))} />
                  </div>
                </div>
                {inputs.slice(0, 3).map(({ key, label, tamil, ...constraints }) => (
                  <label key={key}>{t(label, tamil)}
                    <input className={fieldClass} {...constraints} value={fields[key]}
                      onChange={event => setFields(previous => ({ ...previous, [key]: event.target.value }))} />
                  </label>
                ))}
                <label className="sm:col-span-2">{t('Gender', 'பாலினம்')}
                  <select className={fieldClass} required value={fields.gender}
                    onChange={event => setFields(previous => ({ ...previous, gender: event.target.value }))}>
                    <option value="">{t('Select gender', 'பாலினத்தைத் தேர்ந்தெடு')}</option>
                    {genders.map((gender, index) => <option key={gender} value={gender}>
                      {t(gender, ['ஆண்', 'பெண்', 'திருநர்', 'தெரிவிக்க விரும்பவில்லை'][index])}
                    </option>)}
                  </select>
                </label>
                <h2 className={headingClass}>
                  <Ruler className="h-8 w-8 rounded-md bg-sky-50 p-1.5 text-sky-700" />
                  {t('Body Measurements (optional)', 'உடல் அளவீடுகள் (விருப்பம்)')}
                </h2>
                {inputs.slice(3, 5).map(({ key, label, tamil, ...constraints }) => (
                  <label key={key}>{t(label, tamil)}
                    <input className={fieldClass} {...constraints} value={fields[key]}
                      onChange={event => setFields(previous => ({ ...previous, [key]: event.target.value }))} />
                  </label>
                ))}
                {bmi && <p className="text-sm text-slate-600 sm:col-span-2">{t('BMI', 'உடல் நிறைக் குறியீடு')} · {bmi}</p>}
                <h2 className={headingClass}>
                  <HeartPulse className="h-8 w-8 rounded-md bg-rose-50 p-1.5 text-rose-700" />
                  {t('Blood Pressure (optional)', 'இரத்த அழுத்தம் (விருப்பம்)')}
                </h2>
                {inputs.slice(5).map(({ key, label, tamil, ...constraints }) => (
                  <label key={key}>{t(label, tamil)}
                    <input className={fieldClass} {...constraints} value={fields[key]}
                      onChange={event => setFields(previous => ({ ...previous, [key]: event.target.value }))} />
                  </label>
                ))}
              </fieldset>
              <button className={buttonClass} disabled={submitting}>
                {submitting ? t('Saving…', 'சேமிக்கிறது…') :
                  mode === 'new' ? t('Save registration', 'பதிவைச் சேமி') : t('Save consultation', 'ஆலோசனையைச் சேமி')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
