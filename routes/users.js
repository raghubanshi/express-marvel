/** Routes for users. */
const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();


router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
