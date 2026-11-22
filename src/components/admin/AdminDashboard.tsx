import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  HeartPulse, 
  AlertTriangle, 
  Search, 
  Calendar, 
  RotateCw, 
  LogOut, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  ArrowLeft,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { adminService } from '../../api/admin.service';
import { PatientDetailModal } from './PatientDetailModal';
import type { AdminUser, DashboardStats } from '../../types/admin';
import type { BackendPatientRegistrationResponse } from '../../types/registration';

interface AdminDashboardProps {
  admin: AdminUser;
  onLogout: () => void;
  onGoToPublicPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  onLogout,
  onGoToPublicPortal,
}) => {
  // Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Patients Table state
  const [patients, setPatients] = useState<BackendPatientRegistrationResponse[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);

  // Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal state
  const [selectedPatient, setSelectedPatient] = useState<BackendPatientRegistrationResponse | null>(null);

  // Initial load & refresh triggers
  useEffect(() => {
    let isMounted = true;
    adminService
      .getDashboardStats()
      .then((res) => {
        if (isMounted && res && res.data) {
          setStats(res.data);
        }
      })
      .catch((err: any) => {
        console.error('Failed to load dashboard statistics:', err);
      })
      .finally(() => {
        if (isMounted) setStatsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    adminService
      .getPatients({
        page: currentPage,
        limit: limitPerPage,
        search: searchQuery.trim() || undefined,
        date: dateFilter.trim() || undefined,
      })
      .then((res) => {
        if (isMounted && res && res.data) {
          setPatients(res.data);
          if (res.meta) {
            setTotalPages(res.meta.totalPages);
            setTotalRecords(res.meta.total);
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) setTableError(err.message || 'Failed to load patient records.');
      })
      .finally(() => {
        if (isMounted) setTableLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, limitPerPage, searchQuery, dateFilter]);

  const handleRefresh = () => {
    setStatsLoading(true);
    setTableLoading(true);
    setTableError(null);
    adminService
      .getDashboardStats()
      .then((res) => {
        if (res && res.data) setStats(res.data);
      })
      .catch((err: any) => console.error('Failed to refresh stats:', err))
      .finally(() => setStatsLoading(false));

    adminService
      .getPatients({
        page: currentPage,
        limit: limitPerPage,
        search: searchQuery.trim() || undefined,
        date: dateFilter.trim() || undefined,
      })
      .then((res) => {
        if (res && res.data) {
          setPatients(res.data);
          if (res.meta) {
            setTotalPages(res.meta.totalPages);
            setTotalRecords(res.meta.total);
          }
        }
      })
      .catch((err: any) => setTableError(err.message || 'Failed to refresh patient records.'))
      .finally(() => setTableLoading(false));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const handleLogoutClick = async () => {
    try {
      await adminService.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Admin Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">
                    VARMA NURSING HOME
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Patient Intake & Clinical Vitals Dashboard
                </p>
              </div>
            </div>

            {/* Admin Profile & Actions */}
            <div className="flex items-center gap-3">
              {/* Back to Public Portal Button */}
              <button
                type="button"
                onClick={onGoToPublicPortal}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Patient Registration Form</span>
              </button>

              {/* Admin Profile Pill */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <div className="h-7 w-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  {admin.name.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">{admin.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{admin.email}</p>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-600 ml-1" />
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Logout Admin Session"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Stats Overview Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Overview</h2>
              <p className="text-xs text-slate-500">Live operational metrics from MongoDB</p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={statsLoading || tableLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 text-blue-600 ${statsLoading || tableLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Patients */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registered</p>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {statsLoading ? '...' : (stats?.totalPatients ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400">All registered patients</p>
              </div>
            </div>

            {/* 2. Today's Registrations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Intake</p>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {statsLoading ? '...' : (stats?.todayRegistrations ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400">Registered today</p>
              </div>
            </div>

            {/* 3. Normal BP */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Normal BP</p>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                  {statsLoading ? '...' : (stats?.normalBPCount ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400">&lt;120/&lt;80 mmHg</p>
              </div>
            </div>

            {/* 4. Elevated BP / Alert */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Elevated / High BP</p>
                <div className="text-2xl font-black text-rose-700 font-mono mt-0.5">
                  {statsLoading ? '...' : (stats?.elevatedBPCount ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400">Requires clinical attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Registrations Management Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Section Header & Filters */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Patient Registrations Management
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Displaying all registered patients with clinical vitals from MongoDB
              </p>
            </div>

            {/* Controls: Search, Date Filter, Clear */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by patient name or ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || dateFilter) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Registration ID</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-3">Age</th>
                  <th className="py-3.5 px-3">Gender</th>
                  <th className="py-3.5 px-3">Height</th>
                  <th className="py-3.5 px-3">Weight</th>
                  <th className="py-3.5 px-4">Blood Pressure</th>
                  <th className="py-3.5 px-4">Registered Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {tableLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded-md w-24" /></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded-md w-36" /></td>
                      <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded-md w-8" /></td>
                      <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded-md w-14" /></td>
                      <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded-md w-12" /></td>
                      <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded-md w-12" /></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded-md w-20" /></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded-md w-28" /></td>
                      <td className="py-4 px-4 text-right"><div className="h-7 bg-slate-200 rounded-lg w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : tableError ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-rose-600">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-rose-500" />
                      <p className="font-bold">{tableError}</p>
                      <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Retry Loading Records
                      </button>
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-500">
                      <Users className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                      <p className="font-bold text-slate-800 text-sm">No Patient Registrations Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchQuery || dateFilter
                          ? 'No patients matched your current filter criteria.'
                          : 'No patient registrations have been submitted yet.'}
                      </p>
                      {(searchQuery || dateFilter) && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
                        >
                          Clear Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => {
                    const sys = p.bloodPressureVitals.systolic;
                    const dia = p.bloodPressureVitals.diastolic;
                    const isHighBP = sys >= 130 || dia >= 85;

                    return (
                      <tr 
                        key={p._id} 
                        className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                        onClick={() => setSelectedPatient(p)}
                      >
                        {/* 1. Registration ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {p._id.slice(-8)}
                          <span className="text-[10px] text-slate-400 font-normal block font-sans">
                            #{p._id}
                          </span>
                        </td>

                        {/* 2. Patient Name */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {p.patientIdentity.name}
                        </td>

                        {/* 3. Age */}
                        <td className="py-3.5 px-3 text-slate-700 font-medium">
                          {p.patientIdentity.age}y
                        </td>

                        {/* 4. Gender */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                            p.patientIdentity.gender === 'Female' 
                              ? 'bg-pink-50 text-pink-700 border-pink-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {p.patientIdentity.gender}
                          </span>
                        </td>

                        {/* 5. Height (cm) */}
                        <td className="py-3.5 px-3 font-mono text-slate-800">
                          {p.bodyMeasurements.height} <span className="text-[10px] text-slate-400">cm</span>
                        </td>

                        {/* 6. Weight (kg) */}
                        <td className="py-3.5 px-3 font-mono text-slate-800">
                          {p.bodyMeasurements.weight} <span className="text-[10px] text-slate-400">kg</span>
                        </td>

                        {/* 7 & 8. Systolic & Diastolic BP */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className={`font-bold ${isHighBP ? 'text-rose-600' : 'text-slate-900'}`}>
                              {sys}/{dia}
                            </span>
                            <span className="text-[10px] text-slate-400">mmHg</span>
                            {isHighBP && (
                              <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse ml-0.5" title="Elevated BP" />
                            )}
                          </div>
                        </td>

                        {/* 9. Registration Date & Time */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-medium text-slate-800">{p.registrationTimestamp.date}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.registrationTimestamp.time}</div>
                        </td>

                        {/* Action: View Details */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedPatient(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span>
                Showing <strong>{patients.length > 0 ? (currentPage - 1) * limitPerPage + 1 : 0}</strong> to{' '}
                <strong>{Math.min(currentPage * limitPerPage, totalRecords)}</strong> of <strong>{totalRecords}</strong> patients
              </span>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Per page:</span>
                <select
                  value={limitPerPage}
                  onChange={(e) => {
                    setLimitPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || tableLoading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-mono font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || tableLoading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
};
