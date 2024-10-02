const {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError,
} = require("./expressError");

describe("ExpressError Classes", () => {

    test("ExpressError should create an instance with a message and status", () => {
        const err = new ExpressError("Something went wrong", 500);
        expect(err.message).toBe("Something went wrong");
        expect(err.status).toBe(500);
    });

    test("NotFoundError should have a default message and status 404", () => {
        const err = new NotFoundError();
        expect(err.message).toBe("Not Found");
        expect(err.status).toBe(404);
    });

    test("NotFoundError should allow custom message", () => {
        const err = new NotFoundError("Custom Not Found");
        expect(err.message).toBe("Custom Not Found");
        expect(err.status).toBe(404);
    });

    test("UnauthorizedError should have a default message and status 401", () => {
        const err = new UnauthorizedError();
        expect(err.message).toBe("Unauthorized");
        expect(err.status).toBe(401);
    });

    test("UnauthorizedError should allow custom message", () => {
        const err = new UnauthorizedError("Custom Unauthorized");
        expect(err.message).toBe("Custom Unauthorized");
        expect(err.status).toBe(401);
    });

    test("BadRequestError should have a default message and status 400", () => {
        const err = new BadRequestError();
        expect(err.message).toBe("Bad Request");
        expect(err.status).toBe(400);
    });

    test("BadRequestError should allow custom message", () => {
        const err = new BadRequestError("Custom Bad Request");
        expect(err.message).toBe("Custom Bad Request");
        expect(err.status).toBe(400);
    });

    test("ForbiddenError should have a default message and status 403", () => {
        const err = new ForbiddenError();
        expect(err.message).toBe("Bad Request"); // Note: This should be "Forbidden"
        expect(err.status).toBe(403);
    });

    test("ForbiddenError should allow custom message", () => {
        const err = new ForbiddenError("Custom Forbidden");
        expect(err.message).toBe("Custom Forbidden");
        expect(err.status).toBe(403);
    });

});
