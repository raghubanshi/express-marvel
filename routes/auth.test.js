const request = require("supertest");
const app = require("../app");  // Assuming you have an app.js or index.js exporting your express app
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

jest.mock("../models/user");
jest.mock("../helpers/tokens");

describe("POST /auth/token", () => {
    test("should return a valid token for correct credentials", async () => {
        const mockUser = { username: "testuser" };

        // Mock User.authenticate to return a user
        User.authenticate.mockResolvedValue(mockUser);

        // Mock createToken to return a fake JWT token
        createToken.mockReturnValue("fake-token");

        const resp = await request(app)
            .post("/auth/token")
            .send({ username: "testuser", password: "password" });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ token: "fake-token" });
        expect(User.authenticate).toHaveBeenCalledWith("testuser", "password");
        expect(createToken).toHaveBeenCalledWith(mockUser);
    });

    test("should return 401 for invalid credentials", async () => {
        // Mock User.authenticate to throw an UnauthorizedError
        User.authenticate.mockRejectedValue(new Error("Invalid username/password"));

        const resp = await request(app)
            .post("/auth/token")
            .send({ username: "testuser", password: "wrongpassword" });

        expect(resp.statusCode).toBe(500);
        expect(resp.body.error.message).toEqual("Invalid username/password");
    });
});

describe("POST /auth/register", () => {
    test("should register a new user and return a valid token", async () => {
        const newUser = { username: "newuser" };

        // Mock User.register to return a new user
        User.register.mockResolvedValue(newUser);

        // Mock createToken to return a fake JWT token
        createToken.mockReturnValue("fake-token");

        const resp = await request(app)
            .post("/auth/register")
            .send({ username: "newuser", password: "password" });

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({ token: "fake-token" });
        expect(User.register).toHaveBeenCalledWith({ username: "newuser", password: "password" });
        expect(createToken).toHaveBeenCalledWith(newUser);
    });

    test("should return error for missing fields during registration", async () => {
        // Mock User.register to throw a BadRequestError when fields are missing
        User.register.mockRejectedValue(new Error("Missing required fields"));

        const resp = await request(app)
            .post("/auth/register")
            .send({ password: "password" });  // Missing username

        expect(resp.statusCode).toBe(500);
        expect(resp.body.error.message).toEqual("Missing required fields");
    });
});
