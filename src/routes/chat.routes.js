import { Router } from 'express';

import { getRenderChatController, postNewChatController } from '../controllers/chat.controller.js';

const router = Router();

//GET
router.get('/', getRenderChatController);

//POST
router.post('/newChat', postNewChatController);

export default router