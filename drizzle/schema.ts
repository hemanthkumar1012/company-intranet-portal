import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  subdomain: varchar("subdomain", { length: 80 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  role: mysqlEnum("role", ["admin", "employee"]).default("employee").notNull(),
  empId: varchar("empId", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  department: varchar("department", { length: 120 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId").notNull(),
  workDate: date("workDate").notNull(),
  checkIn: timestamp("checkIn"),
  checkOut: timestamp("checkOut"),
  status: mysqlEnum("status", ["present", "late", "on_leave"]).default("present").notNull(),
  source: mysqlEnum("source", ["biometric", "whatsapp", "manual"]).default("manual").notNull(),
});

export const leaveRequests = mysqlTable("leave_requests", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["sick", "casual"]).notNull(),
  fromDate: date("fromDate").notNull(),
  toDate: date("toDate").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "declined"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const policies = mysqlTable("policies", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  fileUrl: text("fileUrl"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const biometricDevices = mysqlTable("biometric_devices", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  deviceId: varchar("deviceId", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["eSSL", "Matrix"]).notNull(),
  lastSync: timestamp("lastSync"),
  status: mysqlEnum("status", ["online", "offline", "needs_sync"]).default("online").notNull(),
});

export const whatsappAttendanceLogs = mysqlTable("whatsapp_attendance_logs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId"),
  phone: varchar("phone", { length: 40 }).notNull(),
  message: mysqlEnum("message", ["IN", "OUT"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type Policy = typeof policies.$inferSelect;
export type BiometricDevice = typeof biometricDevices.$inferSelect;
export type WhatsAppAttendanceLog = typeof whatsappAttendanceLogs.$inferSelect;
