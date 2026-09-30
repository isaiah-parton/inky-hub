import { db } from "$lib/server/db";
import { usersInOrgs } from "$lib/server/db/schema";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { and, eq } from "drizzle-orm";
import { dev } from "$app/environment";
import { createToken } from "$lib/server/auth";

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const data = await request.json();

	if (!data.orgId) {
		return error(400, { message: "Expected an organization ID" });
	}

	const [membership] = await db
		.select()
		.from(usersInOrgs)
		.where(
			and(
				eq(usersInOrgs.orgId, data.orgId),
				eq(usersInOrgs.userId, locals.user!.id),
			),
		);

	if (!membership) {
		return error(403, {
			message:
				"The requested organization does not exist or you are not a member",
		});
	}

	const token = await createToken({
		userId: membership.userId!,
		orgId: membership.orgId,
		role: membership.role!,
	});
	cookies.set("auth", token, {
		path: "/",
		httpOnly: true,
		secure: !dev,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30,
	});

	return json({ success: true });
};
