//SERVICES DE MONGODB
import { CartManager } from '../dao/mongoDb/cartManager.db.js';
import { ProductManager } from '../dao/mongoDb/productManager.db.js';

const manejoProductos = new ProductManager();
const manejoCarrito = new CartManager();

const getCartByIdController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const carritos = await manejoCarrito.getCartById(req.params.cid);
    res.send(carritos)
}

const postCreateCartController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const result = await manejoCarrito.createCart();
    const rta = JSON.parse(result);
    if (rta.status === "ok") {
        res.status(201);
    } else {
        res.status(500);
    }
    res.send(result);
}

const postAddProductToCartController = async (req, res) => {
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
}

const putUpdateProductOnCartController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const cartId = req.params.cid;
    const carrito = await manejoCarrito.getCartById(cartId);
    if (!carrito.id) {
        res.status(404);
        res.send('{"status":"failed", "message":"Cart not found"}');
    } else {
        //el carrito existe, ahora valido el array de productos enviados desde el body
        const products = req.body.products;
        if (!products) {
            res.status(404);
            res.send('{"status":"failed", "message":"Products not found"}');
        } else {
            //Recorro todo el array de productos y verifico que exista el producto y que la cantidad sea válida
            let productosValidos = true;
            for (let i = 0; i < products.length; i++) {
                const producto = await manejoProductos.getProductById(products[i].product);
                if (producto === false) {
                    productosValidos = false;
                }
                if (isNaN(products[i].quantity) || products[i].quantity < 1) {
                    productosValidos = false;
                }
            }
            if (productosValidos) {
                //actualizo en el carrito el array de productos por el enviado
                const result = await manejoCarrito.updateCart(cartId, products);
                res.send(result);
            } else {
                res.status(401);
                res.send('{"status":"failed", "message":"Invalid products found. Cannot continue"}');
            }
        }
    }
}

const putUpdateProductQuantityController = async (req, res) => {

    res.set('Content-Type', 'application/json');
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    if (cartId && productId && quantity && !isNaN(quantity) && quantity > 0) {
        const result = await manejoCarrito.updateProductQuantity(cartId, productId, quantity);
        res.send(result);
    } else {
        res.status(401);
        res.send('{"status":"failed", "message":"Incomplete or invalid params"}');
    }
}

const deleteProductFromCartController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if (cartId && productId) {
        const result = await manejoCarrito.deleteProductFromCart(cartId, productId);
        res.send(result);
    } else {
        res.status(401);
        res.send('{"status":"failed", "message":"Incomplete params"}');
    }

}

const deleteEmptyCartController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const cartId = req.params.cid;
    if (cartId) {
        const result = await manejoCarrito.emptyCart(cartId);
        res.send(result);
    } else {
        res.status(401);
        res.send('{"status":"failed", "message":"Cart id not specified"}');
    }
}


export { getCartByIdController, postCreateCartController, postAddProductToCartController, putUpdateProductOnCartController, putUpdateProductQuantityController, deleteProductFromCartController, deleteEmptyCartController }