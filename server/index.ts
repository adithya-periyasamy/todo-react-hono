import { Hono } from "hono";
import { getTodos } from "./db/queries";
import { auth } from "./lib/auth";

const app = new Hono().basePath("/api");

const router = app

  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))

  .get("/todos", async (c) => {
    try {
      return c.json(await getTodos());
    } catch (e) {
      console.error(e);
      return c.json({ error: "Something went wrong" }, 500);
    }
  })

  .get("/people", (c) => {
    return c.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ]);
  });

export type AppType = typeof router;
export default app;
