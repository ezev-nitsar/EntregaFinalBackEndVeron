import { Router } from 'express';
import { CartManager } from '../cartManager.js';
import { ProductManager } from '../productManager.js';
const router = Router();

const manejoProductos = new ProductManager('./src/data/products.json');
const manejoCarrito = new CartManager('./src/data/carrito.json');

/*ROUTER QUE MANEJA LOS CARTS

Se llama desde /api/cart

*/

//GET
router.get("/:cid", async (req, res) => {
    res.set('Content-Type', 'application/json');
    const carritos = await manejoCarrito.getCartById(req.params.cid);
    res.send(carritos)
})

//POST
router.post("/", async (req, res) => {
    res.set('Content-Type', 'application/json');
    const result = await manejoCarrito.createCart();
    const rta = JSON.parse(result);
    if (rta.status === "ok") {
        res.status(201);
    } else {
        res.status(500);
    }
    res.send(result);
});

router.post('/:cid/product/:pid', async (req, res) => {
    res.set('Content-Type', 'application/json');
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if (cartId && productId) {
        const productoExiste = await manejoProductos.getProductById(productId);
        if (productoExiste === false) {
            res.status(404);
            res.send('{"status":"failed", "message":"Product not found"}');
        } else {
            const result = await manejoCarrito.addProduct(cartId, productId, 1);
            res.send(result);
        }
    } else {
        res.status(401);
        res.send('{"status":"failed", "message":"Incomplete params"}');
    }
});
export default router;