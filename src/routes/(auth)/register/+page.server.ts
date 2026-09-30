import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/server/db";
import { orgs, users, usersInOrgs } from "$lib/server/db/schema";
import { verifyPassword, createToken, hashPassword } from "$lib/server/auth";
import { dev } from "$app/environment";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const username = (data.get("username") as string)?.trim();
		const email = (data.get("email") as string)?.trim();
		const password = data.get("password") as string;

		if (!email || !password) {
			return fail(400, { error: "Email and password are required" });
		}

		const passwordHash = await hashPassword(password);

		try {
			const [user] = await db
				.insert(users)
				.values({
					name: username,
					email,
					passwordHash,
				})
				.returning();
			const token = await createToken({
				userId: user.id,
				orgId: null,
				role: null,
			});
			cookies.set("auth", token, {
				path: "/",
				httpOnly: true,
				secure: !dev,
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30,
			});
		} catch (e) {
			console.error((e as any).cause ?? e);
			throw e;
		}


		redirect(302, "/machines");
	},
};
