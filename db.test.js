const db = require("./db"); 
describe("Database", () => {

  afterAll(async () => {
    // Close the database connection after all tests are done
    await db.end();
  });

  test("should connect to the database", async () => {
    expect(db).toBeDefined();
  });

  test("should run a sample query", async () => {
    const result = await db.query("SELECT NOW()"); // Just checking that we can run a query
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1); // Expect at least one row (the current timestamp)
  });

});
