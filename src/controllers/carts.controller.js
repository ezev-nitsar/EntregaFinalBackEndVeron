
import { cartManager }  from '../services/factory.js';

const getCartByIdController = async (req, res) => {
    const cartId = req.params.cid;
    const carrito = await cartManager.getCartById(cartId);
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