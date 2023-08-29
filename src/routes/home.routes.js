import { Router } from 'express';
import { ProductManager } from '../dao/mongoDb/productManager.db.js';   

const manejoProductos = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    const productos = await manejoProductos.getProducts();
    res.render('home', {productos: productos});
});

export default router