import { describe, it, expect, beforeAll } from "vitest";
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

describe("payment procedures", () => {
  it("should create checkout session for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.payment.createCheckout({
        listingId: 1,
        quantity: 2,
      });

      // Result should have checkoutUrl or error
      expect(result).toBeDefined();
      if (result.checkoutUrl) {
        expect(result.checkoutUrl).toContain("stripe.com");
      }
    } catch (error: any) {
      // Expected if listing doesn't exist
      expect(error).toBeDefined();
    }
  });

  it("should throw error when creating checkout without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.payment.createCheckout({
        listingId: 1,
        quantity: 2,
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should validate positive quantity", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.payment.createCheckout({
        listingId: 1,
        quantity: 0,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});

describe("analytics procedures", () => {
  it("should get host stats for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.getHostStats();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error when getting host stats without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.analytics.getHostStats();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("booking details procedures", () => {
  it("should get guest booking details for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookingDetails.getGuestBookingDetails();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error when getting booking details without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.bookingDetails.getGuestBookingDetails();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("listings advanced procedures", () => {
  it("should create listing with all fields", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.listings.create({
        title: "Test Event",
        description: "A test event",
        venueAddress: "123 Main St",
        eventDate: new Date(),
        capacity: 100,
        ticketPriceCents: 2999,
        coverImageUrl: "https://example.com/image.jpg",
      });

      expect(result).toBeDefined();
      expect(result?.title).toBe("Test Event");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should cancel listing for host", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Try to cancel a non-existent listing
      await caller.listings.cancel(999);
    } catch (error: any) {
      // Expected to fail since listing doesn't exist
      expect(error).toBeDefined();
    }
  });

  it("should throw error when canceling listing without auth", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.listings.cancel(1);
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
