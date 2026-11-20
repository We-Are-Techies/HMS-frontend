import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Activity, 
  HeartPulse, 
  Ruler, 
  Weight as WeightIcon, 
  RotateCcw, 
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { PatientRegistrationData, FormErrors, PatientRecord } from '../types/registration';

interface RegistrationFormProps {
  onBack: () => void;
  onSubmitSuccess: (record: PatientRecord) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onBack, onSubmitSuccess }) => {
  // Helpers for current date & time formatted
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentTime = () => {
    const today = new Date();
    return today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const [formData, setFormData] = useState<PatientRegistrationData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    systolicBP: '',
    diastolicBP: '',
    registrationDate: getCurrentDate(),
    registrationTime: getCurrentTime(),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchState, setTouchState] = useState<Record<string, boolean>>({});

  // Keep auto-generated time fresh every second until submitted
  useEffect(() => {
    const timer = setInterval(() => {
      setFormData((prev) => ({
        ...prev,
        registrationTime: getCurrentTime(),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Validation logic
  const validateField = (name: keyof PatientRegistrationData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name of the customer is required';
        if (value.trim().length < 2) return 'Please enter a valid full name';
        return undefined;

      case 'age': {
        if (!value.trim()) return 'Age is required (in years)';
        const ageNum = Number(value);
        if (!/^\d+$/.test(value)) return 'Age must be a whole number (no decimals)';
        if (ageNum <= 0 || ageNum > 125) return 'Age must be between 1 and 125 years';
        return undefined;
      }

      case 'gender':
        if (!value) return 'Please select a gender from dropdown';
        return undefined;

      case 'height': {
        if (!value.trim()) return 'Height is required (in cm)';
        const heightNum = Number(value);
        if (!/^\d+$/.test(value)) return 'Height must be a whole number in cm (no decimals)';
        if (heightNum < 30 || heightNum > 260) return 'Height must be between 30 cm and 260 cm';
        return undefined;
      }

      case 'weight': {
        if (!value.trim()) return 'Weight is required (in Kg)';
        const weightNum = Number(value);
        if (!/^\d+$/.test(value)) return 'Weight must be a whole number in Kg (no decimals)';
        if (weightNum < 1 || weightNum > 350) return 'Weight must be between 1 Kg and 350 Kg';
        return undefined;
      }

      case 'systolicBP': {
        if (!value.trim()) return 'Systolic BP is required (mmHg)';
        const sys = Number(value);
        if (!/^\d+$/.test(value)) return 'Systolic BP must be a whole number';
        if (sys < 50 || sys > 260) return 'Systolic BP must be between 50 and 260 mmHg';
        return undefined;
      }

      case 'diastolicBP': {
        if (!value.trim()) return 'Diastolic BP is required (mmHg)';
        const dia = Number(value);
        if (!/^\d+$/.test(value)) return 'Diastolic BP must be a whole number';
        if (dia < 30 || dia > 160) return 'Diastolic BP must be between 30 and 160 mmHg';
        if (formData.systolicBP && dia >= Number(formData.systolicBP)) {
          return 'Diastolic BP must be lower than Systolic BP';
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof PatientRegistrationData, value: string) => {
    // Enforce integer-only on numeric fields
    if (['age', 'height', 'weight', 'systolicBP', 'diastolicBP'].includes(field)) {
      // allow empty string or digits only
      if (value !== '' && !/^\d*$/.test(value)) {
        return; // reject decimals and non-digit characters
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchState((prev) => ({ ...prev, [field]: true }));

    // Real-time inline error clearing/checking
    const fieldError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof PatientRegistrationData>).forEach((key) => {
      if (key !== 'registrationDate' && key !== 'registrationTime') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });

    // Cross-field validation for BP
    if (formData.systolicBP && formData.diastolicBP) {
      if (Number(formData.diastolicBP) >= Number(formData.systolicBP)) {
        newErrors.diastolicBP = 'Diastolic BP must be strictly less than Systolic BP';
      }
    }

    setErrors(newErrors);
    setTouchState({
      name: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      systolicBP: true,
      diastolicBP: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      systolicBP: '',
      diastolicBP: '',
      registrationDate: getCurrentDate(),
      registrationTime: getCurrentTime(),
    });
    setErrors({});
    setTouchState({});
  };

  // Calculated BMI
  const calculateBMI = () => {
    const h = Number(formData.height);
    const w = Number(formData.weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const bmiVal = Number((w / (heightInMeters * heightInMeters)).toFixed(1));
      let category = 'Normal';
      let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      if (bmiVal < 18.5) {
        category = 'Underweight';
        colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
      } else if (bmiVal >= 25 && bmiVal < 30) {
        category = 'Overweight';
        colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
      } else if (bmiVal >= 30) {
        category = 'Obese';
        colorClass = 'text-rose-700 bg-rose-50 border-rose-200';
      }
      return { bmiVal, category, colorClass };
    }
    return null;
  };

  // Blood Pressure Category
  const getBPCategory = () => {
    const sys = Number(formData.systolicBP);
    const dia = Number(formData.diastolicBP);
    if (sys > 0 && dia > 0 && dia < sys) {
      if (sys < 120 && dia < 80) {
        return { label: 'Normal Blood Pressure', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      }
      if (sys >= 120 && sys <= 129 && dia < 80) {
        return { label: 'Elevated BP', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
      }
      if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
        return { label: 'Stage 1 Hypertension', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      }
      if (sys >= 140 || dia >= 90) {
        return { label: 'Stage 2 Hypertension', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      }
    }
    return null;
  };

  const bmiData = calculateBMI();
  const bpCategory = getBPCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate clinical registration processing
    setTimeout(() => {
      const generatedId = `VNH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: PatientRecord = {
        ...formData,
        id: generatedId,
        submittedAt: new Date().toISOString(),
        bmi: bmiData?.bmiVal,
        bmiCategory: bmiData?.category,
        bpCategory: bpCategory?.label,
      };

      setIsSubmitting(false);
      onSubmitSuccess(record);
    }, 600);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Welcome</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-sky-50/80 px-3 py-1.5 rounded-full border border-sky-100">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Official Registration Form</span>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Card Header with Varma Nursing Home Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border-b border-blue-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                Varma Nursing Home • Clinic OPD Intake
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                CLINIC PATIENT REGISTRATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter customer credentials and physiological vitals according to clinic registry standard.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-blue-900/60 border border-blue-700/50 text-xs text-sky-200">
              <Activity className="h-4 w-4 text-sky-400 animate-pulse" />
              <span>Live Patient Intake</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-8">
          {/* SECTION 1: Patient Identity & Demographics */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-700">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                1. Patient Identity & Demographics
              </h3>
            </div>

            <div className="space-y-6">
              {/* Field 1: NAME */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="patient-name"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  NAME <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative">
                    <input
                      id="patient-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Name of the customer"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.name && errors.name
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {touchState.name && errors.name && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  Name of the customer
                </div>
              </div>

              {/* Field 2: AGE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="patient-age"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  AGE <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative flex rounded-lg shadow-2xs">
                    <input
                      id="patient-age"
                      type="text"
                      inputMode="numeric"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="e.g. 42"
                      className={`w-full px-4 py-2.5 rounded-l-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.age && errors.age
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none">
                      Years
                    </span>
                  </div>
                  {touchState.age && errors.age && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.age}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  age in years. No decimals
                </div>
              </div>

              {/* Field 3: GENDER */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="patient-gender"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  GENDER <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative">
                    <select
                      id="patient-gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value as PatientRegistrationData['gender'])}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 bg-white transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                        touchState.gender && errors.gender
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    >
                      <option value="" disabled>-- Select Gender --</option>
                      <option value="1. Male">1. Male</option>
                      <option value="2. Female">2. Female</option>
                    </select>
                    {/* Custom Dropdown Chevron */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {touchState.gender && errors.gender && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.gender}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  drop box 1.Male 2. Female
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Body Vitals & Measurements */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200">
              <div className="p-1.5 rounded-md bg-sky-50 text-sky-700">
                <Ruler className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                2. Body Measurements
              </h3>
            </div>

            <div className="space-y-6">
              {/* Field 4: HEIGHT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="patient-height"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  HEIGHT <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative flex rounded-lg shadow-2xs">
                    <input
                      id="patient-height"
                      type="text"
                      inputMode="numeric"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="e.g. 172"
                      className={`w-full px-4 py-2.5 rounded-l-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.height && errors.height
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none">
                      cm
                    </span>
                  </div>
                  {touchState.height && errors.height && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.height}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  in cm. No decimals.
                </div>
              </div>

              {/* Field 5: WEIGHT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="patient-weight"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  WEIGHT <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative flex rounded-lg shadow-2xs">
                    <input
                      id="patient-weight"
                      type="text"
                      inputMode="numeric"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="e.g. 68"
                      className={`w-full px-4 py-2.5 rounded-l-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.weight && errors.weight
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none">
                      Kg
                    </span>
                  </div>
                  {touchState.weight && errors.weight && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.weight}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  in Kg. No decimals.
                </div>
              </div>

              {/* Auto BMI Badge Preview (if both entered) */}
              {bmiData && (
                <div className="md:col-span-12 md:ml-36 p-3 rounded-xl border bg-slate-50 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <WeightIcon className="h-4 w-4 text-sky-600" />
                    <span>Calculated BMI:</span>
                    <span className="font-mono text-sm text-slate-900">{bmiData.bmiVal} kg/m²</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${bmiData.colorClass}`}>
                    {bmiData.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Blood Pressure Vitals */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-700">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                3. Blood Pressure Vitals
              </h3>
            </div>

            <div className="space-y-6">
              {/* Field 6: SYSTOLIC BLOOD PRESSURE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="systolic-bp"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  SYSTOLIC BLOOD PRESSURE <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative flex rounded-lg shadow-2xs">
                    <input
                      id="systolic-bp"
                      type="text"
                      inputMode="numeric"
                      value={formData.systolicBP}
                      onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                      placeholder="e.g. 120"
                      className={`w-full px-4 py-2.5 rounded-l-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.systolicBP && errors.systolicBP
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none">
                      mmHg
                    </span>
                  </div>
                  {touchState.systolicBP && errors.systolicBP && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.systolicBP}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  Normal upper reading: 90 - 120 mmHg
                </div>
              </div>

              {/* Field 7: DIASTOLIC BLOOD PRESSURE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="diastolic-bp"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5 flex items-center gap-1"
                >
                  DIASTOLIC BLOOD PRESSURE <span className="text-rose-500">*</span>
                </label>
                <div className="md:col-span-6">
                  <div className="relative flex rounded-lg shadow-2xs">
                    <input
                      id="diastolic-bp"
                      type="text"
                      inputMode="numeric"
                      value={formData.diastolicBP}
                      onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                      placeholder="e.g. 80"
                      className={`w-full px-4 py-2.5 rounded-l-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        touchState.diastolicBP && errors.diastolicBP
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none">
                      mmHg
                    </span>
                  </div>
                  {touchState.diastolicBP && errors.diastolicBP && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.diastolicBP}</span>
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 text-xs text-slate-500 pt-2.5 italic">
                  Normal lower reading: 60 - 80 mmHg
                </div>
              </div>

              {/* Auto BP Category Indicator */}
              {bpCategory && (
                <div className="md:col-span-12 md:ml-36 p-3 rounded-xl border bg-slate-50 flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-700">BP Clinical Classification:</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${bpCategory.color}`}>
                    {bpCategory.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Registration Timestamps (Auto Generated) */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200">
              <div className="p-1.5 rounded-md bg-teal-50 text-teal-700">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                4. Registration Timestamp (System Generated)
              </h3>
            </div>

            <div className="space-y-6">
              {/* Field 8: DATE OF REGISTRATION */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="reg-date"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5"
                >
                  DATE OF REGISTRATION
                </label>
                <div className="md:col-span-6">
                  <div className="relative">
                    <input
                      id="reg-date"
                      type="text"
                      readOnly
                      value={formData.registrationDate}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono font-medium text-slate-700 bg-slate-100 select-all cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 pt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AUTO GENERATED
                  </span>
                </div>
              </div>

              {/* Field 9: TIME OF REGISTRATION */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <label 
                  htmlFor="reg-time"
                  className="md:col-span-3 text-sm font-bold text-slate-800 uppercase tracking-wide pt-2.5"
                >
                  TIME OF REGISTRATION
                </label>
                <div className="md:col-span-6">
                  <div className="relative">
                    <input
                      id="reg-time"
                      type="text"
                      readOnly
                      value={formData.registrationTime}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono font-medium text-slate-700 bg-slate-100 select-all cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 pt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AUTO GENERATED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear all fields"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white text-sm font-bold shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Patient Registration...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Registration</span>
                </>
              )}
            </button>
          </div>

          {/* Clinical Notice footer */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-800">
            <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              All registration data is securely recorded for <strong>Varma Nursing Home OPD</strong> consultations.
              Accurate height, weight, and blood pressure readings are vital for clinical dosage and diagnosis.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
