import { Router } from 'express';
import { ProductManager } from '../dao/mongoDb/productManager.db.js';

const manejoProductos = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    const { page, query, sort  } = req.query;
    const productos = await manejoProductos.getProductsPipeline( 12, page, query, sort );
    res.render('product', {productos: productos});
});

export default router;