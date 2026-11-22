# Varma Nursing Home - Patient Registration Frontend

Modern, responsive Clinic Patient Registration UI for **Varma Nursing Home**, fully integrated with the NestJS backend and MongoDB.

---

## 🌟 Features

- **Page 1 (Welcome Screen):** Healthcare hero with Varma Nursing Home branding, NABH accreditation badge, and Prominent **"Next – Register Patient"** button.
- **Page 2 (Patient Registration Form):**
  - **Name:** Text input (Customer name, validated 2–100 chars)
  - **Age:** Number input in Years (Whole number, no decimals)
  - **Gender:** Dropdown select (`1. Male`, `2. Female`)
  - **Height:** Number input in cm (No decimals)
  - **Weight:** Number input in Kg (No decimals)
  - **Systolic Blood Pressure:** Number input in mmHg
  - **Diastolic Blood Pressure:** Number input in mmHg
  - **Date & Time:** Read-only auto-generated timestamps verified by backend
- **Real-time Clinical Intelligence:** Live BMI calculator and standard Blood Pressure classification badges.
- **Backend API Integration:** Direct communication with `POST /api/v1/patient-registrations` using Axios.
- **Feedback & Validation:** Client and server validation error reporting, loading states, duplicate submission prevention, and official registration receipt slip with print capability.
- **Today's Registrations Drawer:** Shows persisted registrations fetched directly from MongoDB.

---

## ⚙️ Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Frontend

```powershell
cd D:\Mypersonal\HMS\HMS_Frontend
npm install
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**
