import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const orgs = pgTable("orgs", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	createdAt: timestamp().notNull().defaultNow(),
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name"),
	email: text("email").unique(),
	passwordHash: text("password_hash"),
	createdAt: timestamp().notNull().defaultNow(),
});

export const usersInOrgs = pgTable("users_in_orgs", {
	userId: uuid("user_id").references(() => users.id),
	orgId: uuid("org_id").references(() => orgs.id),
	role: text("role", { enum: ["owner", "admin"] }),
});

export const machines = pgTable("machines", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: uuid("org_id").notNull().references(() => orgs.id),
	hostname: text("hostname").notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	lastOnlineAt: timestamp(),
});

export const printers = pgTable("printers", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: uuid("org_id").notNull().references(() => orgs.id),
	machineId: uuid("machine_id")
		.references(() => machines.id, { onDelete: "set null" })
		.notNull(),
	name: text("name"),
	driverName: text("driver_name"),
	portName: text("port_name"),
	address: text("address").notNull(),
	status: text("status", { enum: ["idle", "offline", "printing", "error"] }),
});

export type Printer = typeof printers.$inferSelect;

export type Port = {
	mode: "raw" | "lpr";
	name: string;
	address: string;
	lprQueue?: string;
	snmp?: {
		community?: string;
		index?: string;
	}
};

export const printerTemplates = pgTable("printer_templates", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: uuid("org_id").notNull().references(() => orgs.id),
	infPath: text("inf_path").notNull(),
	name: text("name").notNull(),
	port: jsonb("port").$type<Port>(),
});

export const apiKeys = pgTable("api_keys", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: uuid("org_id").references(() => orgs.id),
	name: text("name"),
	level: text("level", {enum: ["readonly", "readwrite"]}).default("readonly"),
	key: text("key").notNull().unique(),
	expiresAt: timestamp(),
	createdAt: timestamp().notNull().defaultNow(),
})
