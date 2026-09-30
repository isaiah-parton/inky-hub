import { db } from "$lib/server/db";
import { eq, getTableColumns, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { machines, printers, type Printer } from "$lib/server/db/schema";
import { json } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("printers");

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

	return { machines: machineRows };
};
