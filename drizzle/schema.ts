import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Copo custom auth table - stores username/password for custom authentication
 */
export const copoAccounts = mysqlTable("copo_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CopoAccount = typeof copoAccounts.$inferSelect;
export type InsertCopoAccount = typeof copoAccounts.$inferInsert;

/**
 * Guest sessions table - stores temporary guest IDs
 */
export const guestSessions = mysqlTable("guest_sessions", {
  id: int("id").autoincrement().primaryKey(),
  guestId: varchar("guestId", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type GuestSession = typeof guestSessions.$inferSelect;
export type InsertGuestSession = typeof guestSessions.$inferInsert;

/**
 * Plost game progress - stores player data for the tree-cutting game
 */
export const plostProgress = mysqlTable("plost_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  money: int("money").default(0).notNull(),
  wood: int("wood").default(0).notNull(),
  carsOwned: text("carsOwned").default("[]").notNull(), // JSON array of car IDs
  landsOwned: text("landsOwned").default("[]").notNull(), // JSON array of land IDs
  level: int("level").default(1).notNull(),
  totalTreesCut: int("totalTreesCut").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlostProgress = typeof plostProgress.$inferSelect;
export type InsertPlostProgress = typeof plostProgress.$inferInsert;

/**
 * Miners Tycoon game progress - stores player data for the tycoon game
 */
export const minersTycoonProgress = mysqlTable("miners_tycoon_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  money: int("money").default(0).notNull(),
  drillsOwned: text("drillsOwned").default("[]").notNull(), // JSON array of drill IDs
  weaponsOwned: text("weaponsOwned").default("[]").notNull(), // JSON array of weapon IDs
  rebirthCount: int("rebirthCount").default(0).notNull(),
  baseSize: int("baseSize").default(1).notNull(), // Increases with each rebirth
  totalOresMined: int("totalOresMined").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MinersTycoonProgress = typeof minersTycoonProgress.$inferSelect;
export type InsertMinersTycoonProgress = typeof minersTycoonProgress.$inferInsert;

/**
 * HOKSHOT game progress - stores player data for the shooting game
 */
export const hokshotProgress = mysqlTable("hokshot_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  money: int("money").default(0).notNull(),
  gunsOwned: text("gunsOwned").default("[]").notNull(), // JSON array of gun IDs
  explosivesOwned: text("explosivesOwned").default("[]").notNull(), // JSON array of explosive IDs
  totalKills: int("totalKills").default(0).notNull(),
  totalDeaths: int("totalDeaths").default(0).notNull(),
  level: int("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HokshotProgress = typeof hokshotProgress.$inferSelect;
export type InsertHokshotProgress = typeof hokshotProgress.$inferInsert;

// TODO: Add additional tables as needed