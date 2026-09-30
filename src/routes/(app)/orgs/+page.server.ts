import { db } from "$lib/server/db";
import { orgs, usersInOrgs } from "$lib/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request, locals, depends }) => {
	depends("orgs");

	const orgRows = await db
		.select({
			...getTableColumns(orgs),
			role: usersInOrgs.role,
		})
		.from(orgs)
		.leftJoin(usersInOrgs, eq(usersInOrgs.userId, locals.user!.id))
		.where(eq(orgs.id, usersInOrgs.orgId));

	return { orgs: orgRows, currentOrgId: locals.user!.orgId };
};
