import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("intranet workspace APIs", () => {
  it("logs in to the demo workspace with subdomain credentials", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.login({
      email: "aarav@northstar.co",
      password: "northstar",
      subdomain: "northstar",
    });
    expect(result).toMatchObject({ companyId: 1, userId: 1, role: "admin", name: "Aarav Mehta" });
    expect(result.token).toContain("demo-1-");
  });

  it("records a check-in and check-out for an employee", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const checkedIn = await caller.attendance.checkin({ companyId: 1, userId: 2, source: "manual" });
    expect(checkedIn).toMatchObject({ companyId: 1, userId: 2, source: "manual", status: "present" });
    expect(checkedIn.checkIn).toBeInstanceOf(Date);
    const checkedOut = await caller.attendance.checkout({ companyId: 1, userId: 2 });
    expect(checkedOut.checkOut).toBeInstanceOf(Date);
  });

  it("applies and approves leave requests", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const request = await caller.leave.applyRequest({ companyId: 1, userId: 2, type: "casual", fromDate: "2026-09-18", toDate: "2026-09-19", reason: "Family commitment" });
    expect(request.status).toBe("pending");
    const approved = await caller.leave.approve({ id: request.id, status: "approved" });
    expect(approved.status).toBe("approved");
  });

  it("returns a matching policy answer", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.ai.policyAsk({ companyId: 1, question: "How many work from home days can I use?" });
    expect(result.matchedPolicy).toBe("Hybrid work policy");
    expect(result.answer).toContain("three days per week");
  });
});
