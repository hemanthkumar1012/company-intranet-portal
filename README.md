# Northstar Intranet

Northstar Intranet is a multi-tenant company operations portal for attendance, leave management, employee records, biometric device synchronization, payslip messaging, and policy assistance. The project includes a responsive employee experience and an administrator control room with role-based navigation.

> **Current implementation:** The UI is fully interactive and includes a demo workspace for validation. The server exposes the requested tRPC contracts and the managed database contains the core intranet schema. External WhatsApp, biometric, payroll, and production identity credentials must be connected before operational deployment.

## Features

| Area | Included capability |
| --- | --- |
| Workspace access | Company subdomain login, demo admin view, demo employee view, and role-based navigation |
| Attendance | Admin live-style attendance table, employee attendance history, check-in/check-out API contracts, WhatsApp webhook contract, and biometric sync contract |
| Leave | Employee leave request form, balances, request history, admin approval and decline actions |
| People | Employee directory, search/filter presentation, and add-employee modal |
| Devices | eSSL and Matrix device inventory, sync status, and sync-now interaction |
| Payslips | Month selection, WhatsApp send workflow, delivery progress, and send archive presentation |
| Policy assistant | Policy suggestions, contextual answers, policy library entry point, and server-side policy search contract |
| Quality | TypeScript validation, production build, Vitest coverage, and browser verification |

## Technology

The application uses the following architecture:

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Lucide icons |
| Backend | Node.js, Express, tRPC |
| Database | MySQL/TiDB through Drizzle ORM |
| Authentication foundation | Manus OAuth scaffold with server-side context support |
| Testing | Vitest and TypeScript compiler checks |
| Runtime | Managed WebDev development server and Node production bundle |

## Repository Structure

```text
client/
  index.html
  src/
    App.tsx                 # Application shell and theme providers
    index.css               # Northstar visual system and responsive layout styles
    pages/Home.tsx          # Login, dashboard, feature views, and interactions

drizzle/
  schema.ts                 # Users, companies, employees, attendance, leave, policies, devices, logs
  migrations/               # Generated database migrations

server/
  routers.ts                # tRPC API contracts and demo service state
  db.ts                     # Drizzle database connection and user helpers
  intranet.test.ts          # Intranet API tests
  auth.logout.test.ts       # Authentication logout test
  _core/                    # Managed WebDev server, OAuth, storage, and runtime infrastructure

README.md
package.json
```

## Getting Started

### Requirements

Use Node.js 22 or a compatible current Node.js release. Use `pnpm` for dependency management. The managed WebDev environment supplies the database and runtime environment variables when the project is opened through WebDev.

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

The development server runs the Vite client and the Express/tRPC server together. The managed project preview is available from the WebDev project dashboard.

### Build the production bundle

```bash
pnpm build
```

### Start the production bundle

```bash
pnpm start
```

## Demo Access

The login screen includes two preview roles. Select the role before signing in.

| Role | Email | Password | Result |
| --- | --- | --- | --- |
| Admin | `aarav@northstar.co` | `northstar` | Admin dashboard with People, Devices, Payslips, and approval controls |
| Employee | `maya@northstar.co` | `northstar` | Employee dashboard with attendance, leave, and policy assistant views |

The workspace field is a presentation of the company subdomain. The server demo login contract validates the `northstar` subdomain.

## API Contracts

The server router implements the core workflows from the developer build sheet.

| Router | Procedures |
| --- | --- |
| `auth` | `companyRegister`, `login`, `addEmployee`, `me`, `logout` |
| `attendance` | `checkin`, `checkout`, `my`, `todayAll`, `whatsappWebhook`, `biometricSync` |
| `leave` | `applyRequest`, `list`, `approve` |
| `biometric` | `list`, `sync` |
| `payslip` | `sendWhatsapp` |
| `ai` | `policyAsk` |

The current router stores demo workflow state in memory so the preview works without seeded production records. The schema and database helper are ready for replacing those demo collections with Drizzle queries.

## Database Schema

The migration creates the following tables:

| Table | Purpose |
| --- | --- |
| `users` | Manus-authenticated user records |
| `companies` | Company name and unique subdomain |
| `employees` | Employee identity, role, department, phone, and employee ID |
| `attendance` | Daily check-in, check-out, status, and source |
| `leave_requests` | Sick/casual leave dates, reason, and approval status |
| `policies` | Searchable company policy content and optional file URL |
| `biometric_devices` | eSSL/Matrix device identity, health, and last sync |
| `whatsapp_attendance_logs` | WhatsApp attendance event history |

The generated migration is stored under `drizzle/`. For schema changes, update `drizzle/schema.ts`, generate a migration, review the SQL, and apply it through the managed WebDev database workflow.

## Testing and Validation

Run the complete automated suite with:

```bash
pnpm test
```

Run the TypeScript check with:

```bash
pnpm check
```

The current test suite covers logout cookie behavior, company login, attendance check-in/check-out, leave application and approval, and policy matching.

The final verified baseline is:

| Check | Result |
| --- | --- |
| Vitest files | 2 passed |
| Vitest tests | 5 passed |
| TypeScript | Passed |
| Production build | Passed |
| Browser verification | Login, admin dashboard, leave approval, employee dashboard, and policy assistant verified |

## Production Integration Checklist

Before using Northstar with real employee data, complete the following integrations:

1. Replace demo login state with the intended company authentication flow and password hashing.
2. Replace in-memory router collections with Drizzle queries and mutations.
3. Configure the MongoDB/WhatsApp requirements from the original build sheet or map them to the managed MySQL/TiDB database and approved messaging provider.
4. Add the real WhatsApp API token and webhook verification settings through the project secret manager.
5. Connect eSSL and Matrix device adapters and validate employee phone and employee-ID mapping.
6. Add payslip PDF generation or storage references and connect the payroll delivery provider.
7. Add audit logging, rate limiting, input validation, and data retention rules before handling production records.
8. Seed the policy library and add file storage for policy documents.

## Design Direction

The interface uses a deep green navigation shell, warm paper-like surfaces, soft green/amber status colors, DM Sans for operational text, and Manrope for headings. The visual system is intentionally quiet and high-contrast so presence, approvals, and exceptions remain easy to scan during a busy workday.

## License

This project is currently maintained as a private company workspace application. Add a formal license before distributing it outside the owning organization.

## References

[1]: https://github.com/hemanthkumar1012/company-intranet-portal "Northstar Intranet GitHub repository"
