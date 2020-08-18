const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("../users/users-router.js")
const authRouter = require("../auth/auth-router.js");
const dbConnection = require("../dbConfig.js");
const protected = require("../auth/protected-mw.js");

const sessionConfiguration = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.COOKIE_SECURE || false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable:true,
    clearInterval: 1000 * 60 * 60,
  }),
};

router.use(express.json());
router.use(cors());
router.use(helmet());
router.use(session(sessionConfiguration));

router.use("/users", protected, usersRouter);
router.use("/register", authRouter);

router.get("/", (req, res) => {
  res.json({ api: "up" })
});

router.get("/hash", (req, res) => {
  try {
    const password = req.headers.password;

    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(password, rounds);
  
    res.status(200).json({ password, hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;