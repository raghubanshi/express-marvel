/** Express app for marvel-comics. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWt } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const charctersRoutes = require("./routes/characters");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWt);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/characters", charctersRoutes);


app.get('/', (req, res) => {
    res.send("Express Marvel Comics");
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});



module.exports = app;