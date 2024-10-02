const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const User = require("./user");

jest.mock("../db");
jest.mock("bcrypt");

describe("User.authenticate", () => {
  test("should authenticate a user with correct credentials", async () => {
    // Mock db response for a found user
    const mockUser = { username: "testuser", password: "hashedpassword" };
    db.query.mockResolvedValueOnce({ rows: [mockUser] });

    // Mock bcrypt to return true for valid password comparison
    bcrypt.compare.mockResolvedValueOnce(true);

    const result = await User.authenticate("testuser", "password");
    
    expect(result).toEqual({ username: "testuser" });
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedpassword");
  });

  test("should throw UnauthorizedError for invalid username", async () => {
    // Mock db to return no user
    db.query.mockResolvedValueOnce({ rows: [] });

    await expect(User.authenticate("invaliduser", "password")).rejects.toThrow(UnauthorizedError);
  });

  test("should throw UnauthorizedError for invalid password", async () => {
    // Mock db response for a found user
    const mockUser = { username: "testuser", password: "hashedpassword" };
    db.query.mockResolvedValueOnce({ rows: [mockUser] });

    // Mock bcrypt to return false for invalid password comparison
    bcrypt.compare.mockResolvedValueOnce(false);

    await expect(User.authenticate("testuser", "wrongpassword")).rejects.toThrow(UnauthorizedError);
  });
});

describe("User.register", () => {
  test("should register a new user successfully", async () => {
    // Mock db to show no duplicate user
    db.query.mockResolvedValueOnce({ rows: [] });

    // Mock bcrypt hashing
    bcrypt.hash.mockResolvedValueOnce("hashedpassword");

    // Mock db to return the newly created user
    const mockNewUser = { username: "newuser" };
    db.query.mockResolvedValueOnce({ rows: [mockNewUser] });

    const result = await User.register({ username: "newuser", password: "password" });

    expect(result).toEqual({ username: "newuser" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password", expect.any(Number));
  });

  test("should throw BadRequestError for duplicate username", async () => {
    // Mock db to return a duplicate user
    db.query.mockResolvedValueOnce({ rows: [{ username: "testuser" }] });

    await expect(User.register({ username: "testuser", password: "password" })).rejects.toThrow(BadRequestError);
  });
});

describe("User.get", () => {
  test("should return user data for valid username", async () => {
    const mockUser = { id: 1, username: "testuser" };

    // Mock db to return the found user
    db.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await User.get("testuser");

    expect(result).toEqual(mockUser);
  });
});
