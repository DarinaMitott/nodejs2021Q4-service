const router = require('express').Router();

// const User = require('./user.model');
const { UserNotFoundError } = require('../../common/errors');
const usersService = require('./user.service');
const userValidator = require('./user.validator');


router.route('/(:userId)?').get(async (req, res) => {
  try {
    const {userId} = req.params;
    if (userId) {
      if (!userValidator.id(userId)) {
        res.status(400).json({error: 'UserID is not valid'});
        return;
      }

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

router.route('/:userId').put(async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userValidator.id(userId)) {
      res.status(400).json({error: 'UserId is not valid'});
      return;
    }

    const toUpdate = {};
    for (const [name, validator] of Object.entries(userValidator.user)) {
      if (req.body[name] !== undefined && !validator(req.body[name])) {
        res.status(400).json({error: `Invalid field "${name}" specified`});
        return;
      }
      toUpdate[name] = req.body[name];
    }

    const updatedUser = await usersService.updateUser(userId, toUpdate);
    res.status(200).json(updatedUser.toResponse())
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

router.route('/').post(async (req, res) => {
  const { name, login, password } = req.body;
  // TODO: validation

  const newUser = await usersService.create(name, login, password);
  res.status(201).json(newUser.toResponse())
});


router.route('/:userId').delete(async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userValidator.id(userId)) {
      res.status(400).json({error: 'UserId is not valid'});
      return;
    }

    await usersService.deleteUser(userId);
    res.status(204).send();
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.status(500).json({error: e.toString()});
  }
})

module.exports = router;
