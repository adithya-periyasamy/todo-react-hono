import { Hono } from "hono";
import { getTodosByUserId } from "../db/queries";

import { authMiddleware } from "../middlewares/auth.middleware";
import { HonoEnv } from "../types";

export const todos = new Hono<HonoEnv>();

todos.use(authMiddleware);

todos.get("/", async (c) => {
  const user = c.get("user");
  try {
    return c.json(await getTodosByUserId(user.id));
  } catch (e) {
    console.error(e);
    return c.json({ error: "Something went wrong" }, 500);
  }
});
