import { Router } from 'express';
import { ProductManager } from '../productManager.js';

const manejoProductos = new ProductManager('./src/data/products.json');
const router = Router();

router.get('/', async (req, res) => {
    res.render('realTimeProducts');
});

export default router