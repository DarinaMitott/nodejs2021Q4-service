import { Router, Request, Response } from 'express';

import * as usersService from './user.service';
import { userValidators, idValidator } from './user.validator';
import {UserUpdateArg} from "./user.service";
import {User} from "./user.model";

export const router = Router();

router.route('/(:userId)?').get(async (req: Request, res: Response) => {

  const {userId} = req.params;
  if (userId) {
    if (!idValidator(userId)) {
      res.status(400).json({error: 'UserID is not valid'});
      return;
    }

    usersService.getById(userId)
      .then(user => {
        if (user === undefined) {
          res.status(404).json({error: 'User not found'});
        } else {
          res.json(user.toResponse());
        }
      })
      .catch(e => {
        res.status(500).json({error: e.toString()});
      });

    return;
  }

  usersService.getAll()
      .then(users => {
        res.json(users.map(x => x.toResponse()));
      })
      .catch(e => res.status(500).json({error: e.toString()}));
});

type ValidatorEntry = ((_x: string|number|unknown) => boolean);
interface IUserKey {
  [key: string]: string | number | undefined
}

router.route('/:userId').put(async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!idValidator(userId)) {
    res.status(400).json({error: 'UserId is not valid'});
    return;
  }

  const toUpdate = {};
  for (let i = 0; i < Object.keys(userValidators).length; i += 1){
    const name: string = Object.keys(userValidators)[i];
    const validator: ValidatorEntry = Object.values(userValidators)[i];
    if (req.body[name] === undefined || !validator(req.body[name])) {
      res.status(400).json({error: `Invalid field "${name}" specified`});
      return;
    }
    (toUpdate as IUserKey)[name] = req.body[name];
  }

  usersService.updateUser(userId, toUpdate as UserUpdateArg)
    .then((updatedUser: User | undefined) => {
      if (updatedUser) {
        res.status(200).json(updatedUser.toResponse());
      } else {
        res.status(404).json({error: 'User not found'});
      }
    }).catch(e => {
      res.status(500).json({error: e.toString()});
  });
});

router.route('/').post(async (req: Request, res: Response) => {
  const { name, login, password } = req.body;
  const newUser = await usersService.create(name, login, password);
  res.status(201).json(newUser.toResponse())
});


router.route('/:userId').delete(async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!idValidator(userId)) {
    res.status(400).json({error: 'UserId is not valid'});
    return;
  }

  usersService.deleteUser(userId)
    .then((deleted) => {
      if (!deleted) {
        res.status(404).json({error: 'User not found'});
      } else {
        res.status(204).send();
      }
    })
    .catch(e => {
      res.status(500).json({error: e.toString()});
    });
})

