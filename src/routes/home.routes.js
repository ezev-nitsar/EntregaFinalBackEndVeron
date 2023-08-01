import { Router } from 'express';
import { ProductManager } from '../productManager.js';

const manejoProductos = new ProductManager('./src/data/products.json');
const router = Router();

router.get('/', async (req, res) => {
    const productos = await manejoProductos.getProducts();
    res.render('home', {productos: productos});
});

export default router