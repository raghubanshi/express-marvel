const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { authenticateJWt, ensureLoggedIn, ensureCorrectUser } = require("./auth");

jest.mock("jsonwebtoken");
jest.mock("../expressError");

describe("authenticateJWT", () => {
    test("should authenticate valid JWT token", () => {
        const req = {
            headers: { authorization: "Bearer validToken" },
        };
        const res = { locals: {} };
        const next = jest.fn();

        jwt.verify.mockReturnValue({ username: "testuser" });

        authenticateJWt(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith("validToken", expect.any(String));
        expect(res.locals.user).toEqual({ username: "testuser" });
        expect(next).toHaveBeenCalled();
    });


    test("should call next on invalid token", () => {
        const req = {
            headers: { authorization: "Bearer invalidToken" },
        };
        const res = { locals: {} };
        const next = jest.fn();

        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        authenticateJWt(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

describe("ensureLoggedIn", () => {
    test("should pass when user is logged in", () => {
        const req = {};
        const res = { locals: { user: { username: "testuser" } } };
        const next = jest.fn();

        ensureLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should throw UnauthorizedError if user is not logged in", () => {
        const req = {};
        const res = { locals: {} };
        const next = jest.fn();

        UnauthorizedError.mockImplementation(() => {
            const error = new Error("Unauthorized");
            error.status = 401;
            return error;
        });

        ensureLoggedIn(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(UnauthorizedError).toHaveBeenCalled();
    });
});

describe("ensureCorrectUser", () => {
    test("should pass when the correct user is authenticated", () => {
        const req = { params: { username: "testuser" } };
        const res = { locals: { user: { username: "testuser" } } };
        const next = jest.fn();

        ensureCorrectUser(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should throw UnauthorizedError if the user is not correct", () => {
        const req = { params: { username: "differentUser" } };
        const res = { locals: { user: { username: "testuser" } } };
        const next = jest.fn();

        UnauthorizedError.mockImplementation(() => {
            const error = new Error("Unauthorized");
            error.status = 401;
            return error;
        });

        ensureCorrectUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(UnauthorizedError).toHaveBeenCalled();
    });

    test("should throw UnauthorizedError if no user is logged in", () => {
        const req = { params: { username: "testuser" } };
        const res = { locals: {} };
        const next = jest.fn();

        UnauthorizedError.mockImplementation(() => {
            const error = new Error("Unauthorized");
            error.status = 401;
            return error;
        });

        ensureCorrectUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(UnauthorizedError).toHaveBeenCalled();
    });
});
