const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", () => {
    const mockUser = { username: "testuser" };

    test("should return a valid JWT token", () => {
        const token = createToken(mockUser);
        const decoded = jwt.verify(token, SECRET_KEY);

        expect(decoded).toEqual(expect.objectContaining({ username: "testuser" }));
    });

    test("should sign the token with the correct secret key", () => {
        const token = createToken(mockUser);
        const decoded = jwt.verify(token, SECRET_KEY);

        expect(decoded).toHaveProperty("username", "testuser");
    });

    test("should throw error if token is invalid", () => {
        const invalidToken = "invalid.token.here";

        expect(() => jwt.verify(invalidToken, SECRET_KEY)).toThrow();
    });
});
