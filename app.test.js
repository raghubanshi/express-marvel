const request = require("supertest");
const app = require("./app"); // Adjust the path as necessary

describe("App", () => {
    describe("GET /", () => {
        it("should respond with a welcome message", async () => {
            const response = await request(app).get("/");

            expect(response.statusCode).toBe(200);
            expect(response.text).toBe("Express Marvel Comics");
        });
    });

    describe("GET /favicon.ico", () => {
        it("should respond with a 204 status", async () => {
            const response = await request(app).get("/favicon.ico");

            expect(response.statusCode).toBe(204);
        });
    });

    describe("404 error handling", () => {
        it("should return 404 for non-existing routes", async () => {
            const response = await request(app).get("/non-existing-route");

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toHaveProperty("message", "Not Found");
            expect(response.body.error).toHaveProperty("status", 404);
        });
    });
});
