import { Router } from 'express';
import { usersControllers } from '../controllers/users.controllers.js'
import { isAdminMiddleware } from '../controllers/sessions.controller.js';
const router = Router();

router.get("/premium/:uid", isAdminMiddleware, usersControllers);

export default router;