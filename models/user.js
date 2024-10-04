"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {

    /** validate username and password formats */
    static validateCredentials(username, password) {
        // Define the validation criteria for username and password
        const usernameRegex = /^.{3,}$/; // At least 3 characters
        const passwordRegex = /^.{5,}$/; // At least 5 characters

        if (!usernameRegex.test(username)) {
            throw new BadRequestError("Invalid username format.  It must be at least 3 characters long.");
        }

        if (!passwordRegex.test(password)) {
            throw new BadRequestError("Invalid password format. It must be at least 5 characters long.");
        }
    }

    /** authenticate user with username, password.
      *
      * Returns { username }
      *
      * Throws UnauthorizedError is user not found or wrong password.
      **/
    static async authenticate(username, password) {

        // try to find the user first
        const result = await db.query(
            `SELECT username,password
               FROM users
               WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username }
     *
     * Throws BadRequestError on duplicates.
     **/
    static async register({ username, password }) {
        // Validate credentials before querying the database
        this.validateCredentials(username, password);

        const duplicateCheck = await db.query(
            `SELECT username
               FROM users
               WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
               (username,
                password)
               VALUES ($1, $2)
               RETURNING username`,
            [username, hashedPassword],
        );

        const user = result.rows[0];

        return user;
    }

    /** Given a username, return data about user.
     *
     * Returns { username }
     * Throws NotFoundError if user not found.
    **/
    static async get(username) {
        const userRes = await db.query(
            `SELECT id,username FROM users WHERE username = $1`,
            [username],
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`No user: ${username}`);
        return user;
    }
}

module.exports = User;
