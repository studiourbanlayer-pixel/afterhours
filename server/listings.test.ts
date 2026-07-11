import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockUser = {
  id: 1,
  openId: "test-user-1",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(): TrpcContext {
  return {
    user: mockUser,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as any,
    res: {} as any,
  };
}

describe("listings procedures", () => {
  it("should get active listings", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.listings.getActive();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get host listings for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.listings.getHostListings();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error when getting host listings without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.listings.getHostListings();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("profile procedures", () => {
  it("should get or create profile for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.getOrCreate();
    expect(result).toBeDefined();
    expect(result?.userId).toBeDefined();
  });

  it("should update profile with role", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.setRole("host");
    expect(result).toBeDefined();
  });

  it("should throw error when updating profile without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.profile.setRole("host");
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("bookings procedures", () => {
  it("should get guest bookings for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getGuestBookings();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error when getting bookings without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.bookings.getGuestBookings();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
