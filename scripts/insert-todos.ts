import { eq } from "drizzle-orm";
import { db } from "../server/db/db";
import { todos, user } from "../server/db/schema";

async function main() {
  try {
    // First, get a valid user ID from the database
    const firstUser = await db.select().from(user).limit(1);

    if (!firstUser || firstUser.length === 0) {
      console.error(
        "No users found in the database. Please create a user first."
      );
      return;
    }

    // Sample todos for testing
    const sampleTodos = [
      {
        title: "Learn TypeScript",
        description:
          "Complete the TypeScript handbook and do some practice exercises",
        completed: false,
        userId: firstUser[0].id,
      },
      {
        title: "Build a React App",
        description: "Create a todo application using React and TypeScript",
        completed: true,
        userId: firstUser[0].id,
      },
      {
        title: "Study Database Design",
        description: "Learn about PostgreSQL and database optimization",
        completed: false,
        userId: firstUser[0].id,
      },
      {
        title: "Practice Testing",
        description:
          "Write unit tests and integration tests for the application",
        completed: false,
        userId: firstUser[0].id,
      },
    ];

    // Insert the todos
    await db.insert(todos).values(sampleTodos);
    console.log("Successfully inserted todos!");

    // Query and show the inserted todos
    const insertedTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, firstUser[0].id));

    console.log("\nInserted todos:", insertedTodos);
  } catch (error) {
    console.error("Error seeding todos:", error);
  }
}

main();

// can run directly using : bun run scripts/insert-todos.ts
