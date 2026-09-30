import { redirect, type Handle } from "@sveltejs/kit";
import { verifyToken } from "$lib/server/auth";
import { sequence } from "@sveltejs/kit/hooks";

export const handle: Handle = sequence(
	// Auth
	async ({ event, resolve }) => {
		const token = event.cookies.get("auth");
		if (token) {
			const payload = await verifyToken(token);
			if (payload) {
				event.locals.user = {
					id: payload.userId,
					orgId: payload.orgId!,
					role: payload.role,
				};
			}
		}

		// (app) routes assume `locals.user` is set; redirect here so page/layout
		// load functions (which run in parallel, not layout-then-page) never see
		// it undefined and throw.
		if (!event.locals.user && event.route.id?.startsWith("/(app)")) {
			redirect(302, "/login");
		}

		return resolve(event);
	},
);
