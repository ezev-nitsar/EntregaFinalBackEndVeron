import { Router } from 'express';
import { getRealTimeProductsController } from '../controllers/realtimeproducts.controller.js';
const router = Router();

//GET
router.get('/', getRealTimeProductsController);

export default router;