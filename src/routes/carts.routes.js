import { Router } from 'express';
import { getCartByIdController } from '../controllers/carts.controller.js';

const router = Router();

//GET
router.get('/:cid', getCartByIdController);

export default router;