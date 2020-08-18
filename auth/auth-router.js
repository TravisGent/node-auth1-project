const router = require("express").Router();
const bcrypt = require("bcrypt");

const Users = require("../users/users-model.js");

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then(user => {
      res.status(201).json({ data: user });
    })
    .catch(error => res.json({ error: error.message }));
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(users => {
      const user = users[0];

      if(user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        res.status(200).json({ hello: user.username, session: req.session });
      } else {
        res.status(401).json({ error: "you shall not pass!" });
      }
    }).catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;