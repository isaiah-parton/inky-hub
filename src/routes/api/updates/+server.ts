import type { RequestHandler } from "./$types";
import postgres from "postgres";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = ({ locals }) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });

  const channel = `org_${locals.user.teamId}`;
  const encoder = new TextEncoder();

  let client: ReturnType<typeof postgres> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      client = postgres(env.DATABASE_DIRECT_URL ?? env.DATABASE_URL, { max: 1, idle_timeout: 0 });

      await client.listen(channel, (payload) => {
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // stream already closed
        }
      });

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 25_000);
    },
    cancel() {
      clearInterval(heartbeat);
      client?.end({ timeout: 1 });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};
