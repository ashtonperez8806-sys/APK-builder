import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { getDb, getUserByOpenId, upsertUser } from "./db";
import { copoAccounts, guestSessions, users, plostProgress, minersTycoonProgress, hokshotProgress } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Custom Copo authentication
    register: publicProcedure
      .input(z.object({
        username: z.string().min(3).max(64),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== input.confirmPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Passwords do not match",
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        // Check if username already exists
        const existing = await db.select().from(copoAccounts).where(eq(copoAccounts.username, input.username)).limit(1);
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already taken",
          });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Create user
        const openId = `copo_${nanoid()}`;
        await upsertUser({
          openId,
          name: input.username,
          loginMethod: "copo",
        });

        // Get the created user
        const user = await getUserByOpenId(openId);
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }

        // Create Copo account
        await db.insert(copoAccounts).values({
          userId: user.id,
          username: input.username,
          passwordHash,
        });

        // Initialize game progress for all three games
        await db.insert(plostProgress).values({
          userId: user.id,
          money: 1000, // Starting money
        });

        await db.insert(minersTycoonProgress).values({
          userId: user.id,
          money: 1000,
        });

        await db.insert(hokshotProgress).values({
          userId: user.id,
          money: 1000,
        });

        return {
          success: true,
          userId: user.id,
          username: input.username,
        };
      }),
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        // Find account by username
        const account = await db.select().from(copoAccounts).where(eq(copoAccounts.username, input.username)).limit(1);
        if (account.length === 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const copoAccount = account[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(input.password, copoAccount.passwordHash);
        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Get user
        const user = await db.select().from(users).where(eq(users.id, copoAccount.userId)).limit(1);
        if (user.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }

        return {
          success: true,
          userId: user[0].id,
          username: input.username,
          openId: user[0].openId,
        };
      }),
    createGuest: publicProcedure
      .mutation(async () => {
        const guestId = `guest_${nanoid(16)}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        await db.insert(guestSessions).values({
          guestId,
          expiresAt,
        });

        return {
          success: true,
          guestId,
        };
      }),
  }),

  // Game progress routers
  plost: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const progress = await db.select().from(plostProgress).where(eq(plostProgress.userId, ctx.user.id)).limit(1);
      return progress.length > 0 ? progress[0] : null;
    }),
    updateMoney: protectedProcedure
      .input(z.object({ amount: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        // Update logic will be implemented
        return { success: true };
      }),
  }),

  minersTycoon: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const progress = await db.select().from(minersTycoonProgress).where(eq(minersTycoonProgress.userId, ctx.user.id)).limit(1);
      return progress.length > 0 ? progress[0] : null;
    }),
  }),

  hokshot: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const progress = await db.select().from(hokshotProgress).where(eq(hokshotProgress.userId, ctx.user.id)).limit(1);
      return progress.length > 0 ? progress[0] : null;
    }),
  }),
});

export type AppRouter = typeof appRouter;
