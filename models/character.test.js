const Character = require('./character'); // Adjust the path as necessary
const db = require('../db'); // Assuming db is your database connection
const { BadRequestError, NotFoundError } = require('../expressError');

// Mock the db.query method
jest.mock('../db');

describe('Character class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        const newCharacter = {
            characterId: '1',
            name: 'Character One',
            image: 'http://example.com/image.jpg',
            description: 'A cool character.',
            userId: 'user1'
        };

        test('should create a character and associate with user', async () => {
            // Mock db queries
            db.query.mockResolvedValueOnce({ rows: [] }) // For duplicate check
                .mockResolvedValueOnce({ rows: [] }) // For character insert (this should do nothing)
                .mockResolvedValueOnce({ rows: [{ characterId: '1', userId: 'user1' }] }); // For user_character insert

            // Mock the result of the final SELECT query
            db.query.mockResolvedValueOnce({
                rows: [{
                    characterId: '1',
                    name: 'Character One',
                    image: 'http://example.com/image.jpg',
                    description: 'A cool character.',
                    userId: 'user1'
                }]
            });

            const character = await Character.create(newCharacter);

            expect(character).toEqual({
                characterId: '1',
                name: 'Character One',
                image: 'http://example.com/image.jpg',
                description: 'A cool character.',
                userId: 'user1'
            });
            expect(db.query).toHaveBeenCalledTimes(4); // Adjusted to account for the additional mock
        });



        test('should throw BadRequestError if characterId or userId is missing', async () => {
            await expect(Character.create({})).rejects.toThrow(BadRequestError);
            await expect(Character.create({ characterId: '1' })).rejects.toThrow(BadRequestError);
            await expect(Character.create({ userId: 'user1' })).rejects.toThrow(BadRequestError);
        });

        test('should throw BadRequestError if character already exists for user', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ user_id: 'user1', character_id: '1' }] }); // Duplicate check

            await expect(Character.create(newCharacter)).rejects.toThrow(BadRequestError);
        });
    });

    describe('remove()', () => {
        const userId = 'user1';
        const characterId = '1';

        test('should delete a character association', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ characterId, userId }] }); // Return character association

            await Character.remove({ userId, characterId });

            expect(db.query).toHaveBeenCalledTimes(1);
        });

        test('should throw NotFoundError if character not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }); // No character found

            await expect(Character.remove({ userId, characterId })).rejects.toThrow(NotFoundError);
        });
    });

    describe('findAllCharacter()', () => {
        const handle = 'user1';

        test('should return all characters for a user', async () => {
            const characters = [
                { character_id: '1', name: 'Character One', image: 'http://example.com/image1.jpg', description: 'First character.' },
                { character_id: '2', name: 'Character Two', image: 'http://example.com/image2.jpg', description: 'Second character.' }
            ];
            db.query.mockResolvedValueOnce({ rows: characters });

            const result = await Character.findAllCharacter(handle);

            expect(result).toEqual(characters);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});
