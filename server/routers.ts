import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const companies = [{ id: 1, name: "Northstar Inc.", subdomain: "northstar" }];
const employees = [
  { id: 1, companyId: 1, name: "Aarav Mehta", email: "aarav@northstar.co", password: "northstar", role: "admin", empId: "NS-001", phone: "+15550000001", department: "Engineering" },
  { id: 2, companyId: 1, name: "Maya Rodriguez", email: "maya@northstar.co", password: "northstar", role: "employee", empId: "NS-002", phone: "+15550000002", department: "People & Culture" },
];
const attendance: Array<{ id: number; companyId: number; userId: number; date: string; checkIn?: Date; checkOut?: Date; status: string; source: string }> = [];
const leaveRequests: Array<{ id: number; companyId: number; userId: number; type: "sick" | "casual"; fromDate: string; toDate: string; reason: string; status: "pending" | "approved" | "declined" }> = [];
const devices = [
  { id: 1, companyId: 1, deviceId: "ESSL-AX4-021", type: "eSSL", lastSync: new Date(), status: "online" },
  { id: 2, companyId: 1, deviceId: "MTX-PRX-104", type: "Matrix", lastSync: new Date(), status: "online" },
];
const policies = [
  { title: "Hybrid work policy", description: "Employees can work remotely up to three days per week with manager alignment. Team anchor days are Tuesday and Thursday." },
  { title: "Leave policy", description: "Employees have 12 casual leave days and 8 sick leave days remaining in the sample workspace. Requests are reviewed within one business day." },
  { title: "Expense policy", description: "Submit expenses within 30 days. Receipts are required for claims above $25 and managers approve requests first." },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function employeeFor(id: number) {
  return employees.find((employee) => employee.id === id);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    companyRegister: publicProcedure
      .input(z.object({ companyName: z.string().min(2), subdomain: z.string().min(2), adminEmail: z.string().email(), password: z.string().min(6) }))
      .mutation(({ input }) => {
        const company = { id: companies.length + 1, name: input.companyName, subdomain: input.subdomain };
        companies.push(company);
        return { company, message: "Company workspace created" };
      }),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string(), subdomain: z.string() }))
      .mutation(({ input }) => {
        const company = companies.find((item) => item.subdomain === input.subdomain);
        const user = employees.find((item) => item.email === input.email && item.password === input.password && item.companyId === company?.id);
        if (!company || !user) throw new Error("Invalid workspace, email, or password");
        return { token: `demo-${user.id}-${Date.now()}`, companyId: company.id, userId: user.id, role: user.role, name: user.name };
      }),
    addEmployee: publicProcedure
      .input(z.object({ companyId: z.number(), name: z.string(), email: z.string().email(), password: z.string().min(6), empId: z.string(), phone: z.string().optional(), department: z.string().optional() }))
      .mutation(({ input }) => {
        const user = { id: employees.length + 1, ...input, phone: input.phone ?? "", department: input.department ?? "", role: "employee" as const, password: input.password };
        employees.push(user);
        return { id: user.id, name: user.name, email: user.email };
      }),
  }),
  attendance: router({
    checkin: publicProcedure.input(z.object({ companyId: z.number(), userId: z.number(), source: z.enum(["biometric", "whatsapp", "manual"]).default("manual") })).mutation(({ input }) => {
      const existing = attendance.find((row) => row.companyId === input.companyId && row.userId === input.userId && row.date === today());
      if (existing) return existing;
      const record = { id: attendance.length + 1, companyId: input.companyId, userId: input.userId, date: today(), checkIn: new Date(), status: "present", source: input.source };
      attendance.push(record);
      return record;
    }),
    checkout: publicProcedure.input(z.object({ companyId: z.number(), userId: z.number() })).mutation(({ input }) => {
      const record = attendance.find((row) => row.companyId === input.companyId && row.userId === input.userId && row.date === today());
      if (!record) throw new Error("Check in before checking out");
      record.checkOut = new Date();
      return record;
    }),
    my: publicProcedure.input(z.object({ userId: z.number() })).query(({ input }) => attendance.filter((row) => row.userId === input.userId).sort((a, b) => b.date.localeCompare(a.date))),
    todayAll: publicProcedure.input(z.object({ companyId: z.number() })).query(({ input }) => attendance.filter((row) => row.companyId === input.companyId && row.date === today()).map((row) => ({ ...row, user: employeeFor(row.userId) }))),
    whatsappWebhook: publicProcedure.input(z.object({ from: z.string(), body: z.enum(["IN", "OUT"]) })).mutation(({ input }) => {
      const user = employees.find((employee) => employee.phone === input.from);
      if (!user) return { reply: "We could not find an employee linked to this number." };
      if (input.body === "IN") {
        const existing = attendance.find((row) => row.userId === user.id && row.date === today());
        if (!existing) attendance.push({ id: attendance.length + 1, companyId: user.companyId, userId: user.id, date: today(), checkIn: new Date(), status: "present", source: "whatsapp" });
        return { reply: `Thanks ${user.name.split(" ")[0]} — your check-in was recorded.` };
      }
      const record = attendance.find((row) => row.userId === user.id && row.date === today());
      if (record) record.checkOut = new Date();
      return { reply: `Thanks ${user.name.split(" ")[0]} — your check-out was recorded.` };
    }),
    biometricSync: publicProcedure.input(z.object({ deviceId: z.string(), empId: z.string(), timestamp: z.coerce.date(), type: z.enum(["IN", "OUT"]) })).mutation(({ input }) => {
      const device = devices.find((item) => item.deviceId === input.deviceId);
      const user = employees.find((item) => item.empId === input.empId);
      if (!device || !user) throw new Error("Device or employee not found");
      device.lastSync = new Date();
      const record = attendance.find((row) => row.userId === user.id && row.date === input.timestamp.toISOString().slice(0, 10));
      if (input.type === "IN" && !record) attendance.push({ id: attendance.length + 1, companyId: user.companyId, userId: user.id, date: input.timestamp.toISOString().slice(0, 10), checkIn: input.timestamp, status: "present", source: "biometric" });
      if (input.type === "OUT" && record) record.checkOut = input.timestamp;
      return { synced: true, deviceId: input.deviceId, employee: user.name };
    }),
  }),
  leave: router({
    applyRequest: publicProcedure.input(z.object({ companyId: z.number(), userId: z.number(), type: z.enum(["sick", "casual"]), fromDate: z.string(), toDate: z.string(), reason: z.string().default("") })).mutation(({ input }) => {
      const record = { id: leaveRequests.length + 1, ...input, status: "pending" as const };
      leaveRequests.push(record);
      return record;
    }),
    list: publicProcedure.input(z.object({ companyId: z.number(), userId: z.number().optional(), role: z.enum(["admin", "employee"]).default("employee") })).query(({ input }) => leaveRequests.filter((row) => row.companyId === input.companyId && (input.role === "admin" || row.userId === input.userId)).map((row) => ({ ...row, user: employeeFor(row.userId) }))),
    approve: publicProcedure.input(z.object({ id: z.number(), status: z.enum(["approved", "declined"]) })).mutation(({ input }) => {
      const record = leaveRequests.find((row) => row.id === input.id);
      if (!record) throw new Error("Leave request not found");
      record.status = input.status;
      return record;
    }),
  }),
  biometric: router({
    list: publicProcedure.input(z.object({ companyId: z.number() })).query(({ input }) => devices.filter((device) => device.companyId === input.companyId)),
    sync: publicProcedure.input(z.object({ deviceId: z.string() })).mutation(({ input }) => { const device = devices.find((item) => item.deviceId === input.deviceId); if (!device) throw new Error("Device not found"); device.lastSync = new Date(); device.status = "online"; return device; }),
  }),
  payslip: router({
    sendWhatsapp: publicProcedure.input(z.object({ companyId: z.number(), month: z.string() })).mutation(({ input }) => ({ companyId: input.companyId, month: input.month, total: employees.filter((employee) => employee.companyId === input.companyId).length, sent: employees.filter((employee) => employee.companyId === input.companyId).length, status: "delivered" as const })),
  }),
  ai: router({
    policyAsk: publicProcedure.input(z.object({ companyId: z.number(), question: z.string().min(2) })).query(({ input }) => {
      const words = input.question.toLowerCase().split(/\s+/);
      const policy = policies.find((item) => words.some((word) => word.length > 3 && `${item.title} ${item.description}`.toLowerCase().includes(word)));
      return { answer: policy?.description ?? "I could not find a matching policy. Please contact People & Culture for help.", matchedPolicy: policy?.title ?? null };
    }),
  }),
});

export type AppRouter = typeof appRouter;
