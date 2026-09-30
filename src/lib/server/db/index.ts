import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { neon, neonConfig } from "@neondatabase/serverless";

// Lazy: SvelteKit's postbuild step imports every +page.server.ts to read
// static exports (e.g. `prerender`), which transitively imports this module
// without a real request context. Building the client eagerly would call
// `neon()` at import time, before DATABASE_URL exists in the build environment.
type Db = ReturnType<typeof drizzle<typeof schema>>;
let _db: Db | undefined;

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    _db ??= drizzle(neon(env.DATABASE_URL!), { schema });
    return Reflect.get(_db, prop, receiver);
  },
});
