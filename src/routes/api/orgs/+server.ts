import { db } from "$lib/server/db";
import { orgs, usersInOrgs } from "$lib/server/db/schema";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();

	const [org] = await db.insert(orgs).values({ name: data.name }).returning();

	await db
		.insert(usersInOrgs)
		.values({ userId: locals.user!.id, orgId: org.id, role: "owner" });

	return json({ org });
};
