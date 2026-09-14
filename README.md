# Company Intranet Portal

This repository now contains the implementation required by the supplied **Company Intranet Portal – Developer Build Sheet**.

## Required stack

- Frontend: **Next.js** (App Router)
- Backend: **Node.js + Express**
- Database: **MongoDB / Mongoose**
- Authentication: **JWT + bcryptjs**
- HTTP client: **Axios**

## Repository structure

```text
backend/
  src/
    app.js
    config/db.js
    middleware/auth.js
    models/
      Company.js
      User.js
      Attendance.js
      Leave.js
      Policy.js
      BiometricDevice.js
      WhatsAppAttendanceLog.js
    routes/
      auth.js
      attendance.js
      leave.js
      biometric.js
      payslip.js
      ai.js
  .env.example
  package.json

frontend/
  app/
    login/page.jsx
    register/page.jsx
    admin/page.jsx
    employee/page.jsx
    attendance/page.jsx
    leave/page.jsx
    biometric/page.jsx
    payslip/send/page.jsx
    ai-assistant/page.jsx
  lib/api.js
  .env.example
  package.json
```

## Implemented build-sheet workflows

- Company registration with unique subdomain.
- Admin login and employee login using subdomain + email + password.
- Admin employee creation.
- Employee check-in and check-out.
- Employee attendance history.
- Admin today-attendance view.
- Leave application and admin approval.
- WhatsApp `IN`/`OUT` webhook attendance logging.
- Biometric device registration and sync endpoint for eSSL/Matrix event feeds.
- Payslip PDF generation endpoint and WhatsApp delivery integration point.
- Policy assistant using company-scoped policy search.
- Multi-tenant filtering through `companyId` on authenticated operations.
- Environment templates and GitHub Actions validation for both applications.

## Run locally

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on port **5000** by default.

Required `.env` values:

```env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs on port **3000**.

Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` for local development.

## MongoDB Atlas

Create an Atlas cluster, create a database user, allow the required client IP range, and place the generated connection string in `backend/.env`. Do not commit credentials.

## API surface

| API | Method |
| --- | --- |
| `/api/auth/company-register` | POST |
| `/api/auth/login` | POST |
| `/api/auth/add-employee` | POST |
| `/api/attendance/checkin` | POST |
| `/api/attendance/checkout` | POST |
| `/api/attendance/my` | GET |
| `/api/attendance/today-all` | GET |
| `/api/leave/apply` | POST |
| `/api/leave/list` | GET |
| `/api/leave/:id/approve` | PUT |
| `/api/attendance/whatsapp/webhook` | POST |
| `/api/biometric/sync` | POST |
| `/api/biometric/devices` | GET |
| `/api/payslip/send-whatsapp` | POST |
| `/api/ai/policy-ask` | POST |

## Notes on external integrations

The build sheet specifies `WHATSAPP_TOKEN` and device integration requirements but does not provide provider credentials or the exact eSSL/Matrix device protocol. The code therefore exposes the required API contracts and data flow without inventing vendor credentials or undocumented device protocols. The payslip endpoint generates a PDF for each employee and reports whether WhatsApp delivery is configured; the provider-specific sender can be attached using the supplied WhatsApp credentials.

## Verification

GitHub Actions workflow `.github/workflows/pdf-compliance.yml` installs the backend and checks the server/routes for syntax errors, then installs the frontend and runs a production Next.js build.
