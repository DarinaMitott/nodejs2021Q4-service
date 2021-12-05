const router = require('express').Router();

// const User = require('./user.model');
const { UserNotFoundError } = require('../../common/errors');
const usersService = require('./user.service');

router.route('/(:userId)?').get(async (req, res) => {
  try {
    const {userId} = req.params;
    if (userId) {
      // TODO: validate
      const user = await usersService.getById(userId);
      res.json(user.toResponse());
      return;
    }
    const users = await usersService.getAll();
    // map user fields to exclude secret fields like "password"
    res.json(users.map(x => x.toResponse()));
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      res.status(404).json({error: e.toString()});
    } else {
      res.status(500).json({error: e.toString()});
    }
  }
});

router.route('/').post(async (req, res) => {
  const { name, login, password } = req.body;
  // TODO: validation

  const newUser = await usersService.create(name, login, password);
  res.status(201).json(newUser.toResponse())
});

module.exports = router;
