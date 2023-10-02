//SERVICES DE MONGODB
import { CartManager } from '../dao/mongoDb/cartManager.db.js';

const getCartByIdController = async (req, res) => {
    const cartId = req.params.cid;
    const manejoCarrito = new CartManager();
    const carrito = await manejoCarrito.getCartById(cartId);
    if (carrito) {
        res.render('carts', { carrito: carrito.products });
    } else {
        res.set('Content-Type', 'application/json');
        res.status(404);
        res.send('{"status":"failed", "message":"Cart not found"}');
    }
}

export {
    getCartByIdController
}