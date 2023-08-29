import { Router } from 'express';

//SERVICES DE MONGODB
import { CartManager } from '../dao/mongoDb/cartManager.db.js';

const router = Router();

//GET
router.get('/:cid', async (req, res) => {
    
    const cartId = req.params.cid;
    const manejoCarrito = new CartManager();
    const carrito = await manejoCarrito.getCartById(cartId);
    if (carrito) {
        res.render('carts', {carrito: carrito.products});
    } else {
        res.set('Content-Type', 'application/json');
        res.status(404);
        res.send('{"status":"failed", "message":"Cart not found"}');
    }
});

export default router;