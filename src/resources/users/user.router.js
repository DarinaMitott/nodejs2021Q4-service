const router = require('express').Router();
// const User = require('./user.model');
const usersService = require('./user.service');

router.route('/').get(async (req, res) => {
  const users = await usersService.getAll();
  // map user fields to exclude secret fields like "password"
  res.json(users.map(x => x.toResponse()));
});

router.route('/').post(async (req, res) => {
  const { name, login, password } = req.body;
  // TODO

  const newUser = await usersService.create(name, login, password);
  res.json(newUser.toResponse())
});

module.exports = router;
