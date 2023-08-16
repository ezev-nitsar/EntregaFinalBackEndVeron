import { cartModel } from "../models/cart.model.js";
export class CartManager {
    constructor(fileName = "") {
        //Estado inicial, Array carts vacío y definición de la base de datos a utilizar (se deja filename por retrocompatibilidad con fs)
        this.carts = [];
    }
   

    //Función que devuelve los carritos en la BBDD
    cargarCarrito = async () => {
        let carritos = [];
        try {
            carritos = await cartModel.find().lean();
        } catch (error) {
            console.log("ERROR: " +  error);
        }
        return carritos;
    }

    createCart = async () => {
        this.carts = await this.cargarCarrito();
        const products = [];
        const cart = {
            products
        }
        if (this.carts.length === 0) {
            cart.id = 1;
        } else {
            const nuevoId = Math.max(...this.carts.map(x => x.id));
            cart.id = nuevoId + 1;
        }
        this.carts.push(cart);
        try {
            await cartModel.create({id: cart.id, products: cart.products});
            return '{"status": "ok", "message": "Cart created successfully. ID: ' + cart.id + '"}' ;
        } catch (error) {
            return '{"status": "failed", "message": "Error when creating cart: ' + error + '"}' ;
        }
    }

    addProduct = async (idCarrito, idProducto, cantidad) => {
        if (!idProducto || !cantidad || isNaN(cantidad) || !idCarrito) {
            return '{"status":"failed", "message":"Validation error. Please review your inputs and try again"}';
        } else {
            this.carts = await this.cargarCarrito();
            const nuevoProducto = {
                product: parseInt(idProducto),
                quantity: parseInt(cantidad)
            }
            if (this.carts) {
            const carritoEncontrado = this.carts.find(x => x.id === parseInt(idCarrito));
            if (carritoEncontrado) {
                const productoYaExistente = carritoEncontrado.products.find(x => x.product === parseInt(idProducto));
                const indexCarrito = this.carts.findIndex(obj => obj.id === parseInt(idCarrito));
                if (productoYaExistente) {
                    const indexProducto = this.carts[indexCarrito].products.findIndex(obj => obj.product === parseInt(idProducto));
                    this.carts[indexCarrito].products[indexProducto].quantity += parseInt(cantidad);
                } else {
                    this.carts[indexCarrito].products.push(nuevoProducto);
                }
                try {
                    await cartModel.updateOne({id: idCarrito}, {products: this.carts[indexCarrito].products});
                }
                catch (error) {
                    console.log("ERROR: " + error);
                }
                return '{"status": "ok"}';

            } else {
                return '{"status":"failed", "message":"Cart does not exists"}';
            }
            }
        }
    }

    getCartById = async (cartId) => {
        const carritoEncontrado = await cartModel.findOne({id: cartId});
        if (carritoEncontrado) {
            return { id: carritoEncontrado.id, products: carritoEncontrado.products}
        } else {
            return '{"status":"failed", "message":"Cart does not exists"}';
        }
    }
}