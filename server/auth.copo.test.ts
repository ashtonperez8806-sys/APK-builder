import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Copo Authentication", () => {
  describe("auth.register", () => {
    it("should reject passwords that do not match", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          username: "testuser",
          password: "password123",
          confirmPassword: "password456",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Passwords do not match");
      }
    });

    it("should reject passwords shorter than 6 characters", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          username: "testuser",
          password: "pass",
          confirmPassword: "pass",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });

    it("should reject usernames shorter than 3 characters", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          username: "ab",
          password: "password123",
          confirmPassword: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("auth.createGuest", () => {
    it("should create a guest session with a valid guest ID", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.createGuest();

      expect(result.success).toBe(true);
      expect(result.guestId).toBeDefined();
      expect(result.guestId).toMatch(/^guest_/);
    });

    it("should generate unique guest IDs", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result1 = await caller.auth.createGuest();
      const result2 = await caller.auth.createGuest();

      expect(result1.guestId).not.toBe(result2.guestId);
    });
  });

  describe("auth.logout", () => {
    it("should clear the session cookie and report success", async () => {
      const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

      const user: AuthenticatedUser = {
        id: 1,
        openId: "copo_test",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "copo",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      const ctx: TrpcContext = {
        user,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {
          clearCookie: (name: string, options: Record<string, unknown>) => {
            clearedCookies.push({ name, options });
          },
        } as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies.length).toBeGreaterThan(0);
    });
  });

  describe("auth.me", () => {
    it("should return null for unauthenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeNull();
    });

    it("should return user info for authenticated users", async () => {
      const user: AuthenticatedUser = {
        id: 1,
        openId: "copo_test",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "copo",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      const ctx: TrpcContext = {
        user,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();

      expect(result).toEqual(user);
    });
  });
});
