import { Router } from 'express';
import { ProductManager } from '../dao/mongoDb/productManager.db.js';

const manejoProductos = new ProductManager();
const router = Router();

/*ROUTER QUE MANEJA LOS PRODUCTOS

Se llama desde /api/products

*/

//GET
router.get('/', async (req, res) => {
    const { limit, page, query, sort } = req.query;
    res.set('Content-Type', 'application/json');
    const productos = await manejoProductos.getProductsPipeline(parseInt(limit), parseInt(page), query, sort);
    res.status(200);
    res.send(productos);
    
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const productoBuscado = await manejoProductos.getProductById(productId);
    res.set('Content-Type', 'application/json');
    if (productoBuscado !== false) {
        res.status(200);
        res.send(productoBuscado);
    } else {
        res.status(404);
        res.send('{"status": "failed", "message": "Product not found"}');
    }
});

//POST
router.post('/', async (req, res) => {
    res.set('Content-Type', 'application/json');
    const nuevoProducto = JSON.parse(await manejoProductos.addProduct(req.body));
    if (nuevoProducto.status === "ok") {
        res.send(`{"status": "ok"}`);
    } else {
        res.send(`{"status": "failed", "message": "${nuevoProducto.message}" }`);
    }
});

//PUT
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    res.set('Content-Type', 'application/json');
    const actualizarProducto = JSON.parse(await manejoProductos.updateProduct(productId, req.body));
    if (actualizarProducto.status === "ok") {
        res.status(201);
        res.send(`{"status": "ok"}`);
    } else {
        res.status(400);
        res.send(`{"status": "failed", "message": "${actualizarProducto.message}" }`);
    }
});

//DELETE
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    res.set('Content-Type', 'application/json');
    const eliminarProducto = JSON.parse(await manejoProductos.deleteProduct(productId));
    if (eliminarProducto.status === "ok") {
        res.send(`{"status": "ok"}`);
    } else {
        res.send(`{"status": "failed", "message": "${eliminarProducto.message}" }`);
    }
});


export default router;