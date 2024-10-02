const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Character {
    static async create({ characterId, name, image, description, userId }) {

        // Ensure that characterId and userId are not null or undefined
        if (!characterId || !userId) {
            throw new BadRequestError('Character ID and User ID must be provided.');
        }

        // Check if the character is already associated with the user in the user_characters table
        const duplicateCheck = await db.query(
            `SELECT user_id, character_id
               FROM user_characters
               WHERE user_id = $1 AND character_id = $2`,
            [userId, characterId]
        );

        // If the character is already associated with the user, throw an error
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Character ${characterId} is already associated with this user.`);

        // Insert character into the characters table if it does not exist
        await db.query(
            `INSERT INTO characters (character_id, name, image, description)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (character_id) DO NOTHING`,
            [characterId, name, image, description]
        );

        // Insert into user_characters to link the character to the user
        await db.query(
            `INSERT INTO user_characters (user_id, character_id)
             VALUES ($1, $2)
             RETURNING character_id, user_id`,
            [userId, characterId]
        );

        // Fetch the full character info along with the user association
        const result = await db.query(
            `SELECT c.character_id AS "characterId",
                    c.name,
                    c.image,
                    c.description,
                    uc.user_id AS "userId"
               FROM characters c
               JOIN user_characters uc ON c.character_id = uc.character_id
               WHERE uc.user_id = $1 AND c.character_id = $2`,
            [userId, characterId]
        );

        return result.rows[0];
    }

    /** Delete given character from database; returns undefined.
   *
   * Throws NotFoundError if character not found.
   **/

    static async remove({ userId, characterId }) {
        console.log(userId, characterId);

        const result = await db.query(
            `DELETE
                 FROM user_characters
                 WHERE user_id = $1 AND character_id = $2
                 RETURNING character_id AS "characterId", user_id AS "userId"`,
            [userId, characterId]
        );
        const character = result.rows[0];

        if (!character) throw new NotFoundError(`No Character`);
    }

    static async findAllCharacter(handle) {
        const characterRes = await db.query(
            `SELECT c.character_id, c.name, c.image, c.description
                FROM characters c
                JOIN user_characters uc ON c.character_id = uc.character_id
                WHERE uc.user_id = $1
                ORDER BY c.id DESC`,
            [handle]);

        const character = characterRes.rows;

        if (!character) throw new NotFoundError(`No character`);

        return character;

    }
}


module.exports = Character