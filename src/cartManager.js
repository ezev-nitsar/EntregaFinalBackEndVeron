import fs from 'fs';
export class CartManager {
    constructor(fileName) {
        //Estado inicial, Array carts vacío y definición del archivo a utilizar
        this.carts = [];
        this.fileName = fileName;
    }
     //Funcion de Lectura y Parseo del archivo reconvertida a ASYNC
     readFileAsync = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileName, 'utf8', (err, data) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(JSON.parse(data));
                }
            })
        });
    }

    writeFileAsync = async () => {
        await fs.writeFile(this.fileName, JSON.stringify(this.carts), (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }

    //Función que verifica si hay carts en el archivo y, de ser así, lo actualiza en this.carts
    cargarCarrito = async () => {
        let cartsGuardados = [];
        try  {
            cartsGuardados = await this.readFileAsync();
            if (cartsGuardados.length > 0) {
                this.carts = cartsGuardados;
            }
        } catch (err) {
            
        }
    }

    createCart = async () => {
        await this.cargarCarrito();
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
            this.writeFileAsync();
            return '{"status": "ok", "message": "Cart created successfully. ID: ' + cart.id + '"}' ;
        } catch (error) {
            return '{"status": "failed", "message": "Error when creating cart: ' + error + '"}' ;
        }
    }

    addProduct = async (idCarrito, idProducto, cantidad) => {
        if (!idProducto || !cantidad || isNaN(cantidad) || !idCarrito) {
            return '{"status":"failed", "message":"Validation error. Please review your inputs and try again"}';
        } else {
        await this.cargarCarrito();
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
                    this.writeFileAsync();
                }
                catch (error) {
    
                }
                return '{"status": "ok"}';

            } else {
                
                return '{"status":"failed", "message":"Cart does not exists"}';
            }
            }
        }
    }

    getCartById = async (cartId) => {
        await this.cargarCarrito();
        const carritoEncontrado = this.carts.find(x => x.id === parseInt(cartId));
        if (carritoEncontrado) {
            return carritoEncontrado;
        } else {
            return '{"status":"failed", "message":"Cart does not exists"}';
        }
    }
}