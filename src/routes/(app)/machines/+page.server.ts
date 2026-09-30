import { db } from "$lib/server/db";
import { and, eq, getTableColumns, lte, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import {
	joinCodes,
	machines,
	printers,
	type Printer,
} from "$lib/server/db/schema";
import { error, json, redirect } from "@sveltejs/kit";
import { randomBytes } from "node:crypto";
import { DateTime } from "luxon";
import { generateApiKey } from "$lib/shared/api-key";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("printers");

	if (!locals.user?.orgId) {
		return redirect(301, "/orgs");
	}

	try {
		// Auto rotate and regen join codes
		await db
			.delete(joinCodes)
			.where(
				and(
					eq(joinCodes.orgId, locals.user!.orgId),
					lte(joinCodes.expiresAt, new Date()),
				),
			);

		let [joinCode] = await db
			.select()
			.from(joinCodes)
			.where(eq(joinCodes.orgId, locals.user.orgId))
			.limit(1);

		if (!joinCode) {
			[joinCode] = await db
				.insert(joinCodes)
				.values({
					orgId: locals.user!.orgId,
					code: generateApiKey(),
					expiresAt: DateTime.now().plus({ hours: 6 }).toJSDate(),
				})
				.returning();
		}

		const machineRows = await db
			.select({
				...getTableColumns(machines),
				printers: sql<Printer[]>`coalesce(
					json_agg(${machines}) filter (where ${printers.id} is not null),
					'[]'::json
				)`.as("printers"),
			})
			.from(machines)
			.leftJoin(printers, eq(printers.machineId, machines.id))
			.groupBy(machines.id)
			.where(eq(machines.orgId, locals.user!.orgId));
		return { machines: machineRows, joinCode };
	} catch (err) {
		console.error((err as any).cause ?? err);
		return error(500, { message: (err as any).cause });
	}
};
