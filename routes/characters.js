const express = require("express");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Character = require("../models/character");
const router = express.Router();

router.post("/favorite/:username/:handle", ensureCorrectUser, async function (req, res, next) {
    try {
        const character = await Character.create(req.body);
        return res.status(201).json({ character });
    } catch (err) {
        return next(err);
    }
});

router.get("/favorite/:username/:handle", ensureCorrectUser, async function (req, res, next) {
    try {
        const character = await Character.findAllCharacter(req.params.handle);
        return res.json({ character });
    } catch (err) {
        return next(err);
    }
});

router.delete("/favorite/:username/:handle", ensureCorrectUser, async function (req, res, next) {
    try {
        await Character.remove(req.body);
        return res.json({ deleted: "Character Deleted" });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;

