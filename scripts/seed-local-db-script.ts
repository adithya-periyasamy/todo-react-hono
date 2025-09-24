import { seed } from "drizzle-seed";
import { db, pool } from "../server/db/db";
import * as schema from "../server/db/schema";

const seedDb = async () => {
  await seed(db, schema).refine((funcs) => ({
    todos: {
      columns: {
        title: funcs.valuesFromArray({
          values: ["Buy groceries", "Read a book", "Call mom"],
        }),
        description: funcs.valuesFromArray({
          values: ["At 5pm", "Weekly", "Carefully", undefined],
        }),
      },
    },
  }));
};

seedDb()
  .then(() => {
    console.log("seeded database successfully");
    return pool.end();
  })
  .catch((err) => {
    console.error(`failed to seed database:\n${err}`);
    return pool.end();
  });
