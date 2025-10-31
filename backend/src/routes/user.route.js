import {register , login , logout} from './../controllers/user.controller.js';

import express from 'express';


const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').get(logout);

export default router;