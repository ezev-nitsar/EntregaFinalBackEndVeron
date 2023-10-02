import { ProductManager } from '../dao/mongoDb/productManager.db.js';   
const manejoProductos = new ProductManager();

const getHomeRenderController   = async (req, res) => {
        const productos = await manejoProductos.getProducts();
        res.render('home', {productos: productos});
}

export { getHomeRenderController }