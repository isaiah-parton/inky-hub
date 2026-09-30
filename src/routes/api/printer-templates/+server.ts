import { db } from "$lib/server/db";
import { printers, printerTemplates } from "$lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, { message: "Not logged in!" });
	}

	const rows = db
		.select()
		.from(printerTemplates)
		.where(eq(printerTemplates.orgId, locals.user!.orgId));

	return json({ printerTemplates: rows });
};
