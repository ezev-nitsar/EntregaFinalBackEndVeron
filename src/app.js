import express from 'express';
import productsRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import homeRoutes from './routes/home.routes.js';
import realTimeProducts from './routes/realtimeproducts.routes.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { ProductManager } from './productManager.js';
const manejoProductos = new ProductManager('./src/data/products.json');

const app = express();
const PORT = 8080;

//app.set('json spaces', 2)
app.set('views', __dirname +'/views');
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/home", homeRoutes);
app.use("/realtimeproducts", realTimeProducts);

const httpServer = app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`)
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async socket => {
    const productos = await manejoProductos.getProducts();
    socket.emit('products', productos);
    socket.on('updateRequest', async () => {
        const productos = await manejoProductos.getProducts();
        socket.emit('products', productos);
    })
});



