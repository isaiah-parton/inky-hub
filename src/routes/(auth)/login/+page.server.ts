import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/server/db";
import { users, usersInOrgs } from "$lib/server/db/schema";
import { verifyPassword, createToken } from "$lib/server/auth";
import { dev } from "$app/environment";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();

		const data = await request.formData();
		const email = (data.get("email") as string)?.trim();
		const password = data.get("password") as string;

		if (!email || !password) {
			return fail(400, { error: "Email and password are required" });
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (
			!user?.passwordHash ||
			!(await verifyPassword(password, user.passwordHash))
		) {
			return fail(400, { error: "Invalid email or password" });
		}

		const [membership] = await db
			.select({ orgId: usersInOrgs.orgId, role: usersInOrgs.role })
			.from(usersInOrgs)
			.where(eq(usersInOrgs.userId, user.id))
			.limit(1);

		if (!membership) {
			return fail(400, {
				error: "Account has no organisation. Please contact support.",
			});
		}

		const token = await createToken({
			userId: user.id,
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

		redirect(302, "/machines");
	},
};
