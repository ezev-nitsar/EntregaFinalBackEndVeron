import { ProductManager } from '../dao/mongoDb/productManager.db.js';

const manejoProductos = new ProductManager();

const authMiddleWareController = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

const getProductController = async (req, res) => {
    const { page, query, sort  } = req.query;
        const productos = await manejoProductos.getProductsPipeline( 12, page, query, sort );
        res.render('product', {productos: productos, user: req.session.user });
}

export { getProductController, authMiddleWareController }