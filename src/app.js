import express from 'express';
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import homeRoutes from './routes/home.routes.js';
import chatRoutes from './routes/chat.routes.js'
import cartsRoutes from './routes/carts.routes.js';
import productRoutes from './routes/product.routes.js';
import realTimeProducts from './routes/realtimeproducts.routes.js';
import userRoutes from './routes/users.views.routes.js';
import sessionRoutes from './routes/sessions.routes.js';
import logoutRoutes from './routes/logout.routes.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { ProductManager } from './dao/mongoDb/productManager.db.js';
import { MessageManager } from './dao/mongoDb/messageManager.db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const manejoProductos = new ProductManager();
const connectionURL = "mongodb+srv://veronezequiel:oqpdVmpFMGPEoXbS@cluster0.0iuca9l.mongodb.net/ecommerce_e2?retryWrites=true&w=majority";

const app = express();
const PORT = 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
    store: MongoStore.create({ mongoUrl: connectionURL, mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 10 * 60 }),
    secret: 'pss4secretEAV',
    resave: false,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/home", homeRoutes);
app.use("/realtimeproducts", realTimeProducts);
app.use("/messages", chatRoutes)
app.use("/carts", cartsRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/logout", logoutRoutes);

const connectMongoDB = async () => {
    try {
        await mongoose.connect(connectionURL);
        console.log("MongoDB conectado correctamente");
    }
    catch (error) {
        console.log("Error al conectar a la BBDD: " + error);
    }
}

connectMongoDB();

const httpServer = app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`)
});

const socketServer = new Server(httpServer);

const messageManager = new MessageManager();

socketServer.on('connection', async socket => {
    const productos = await manejoProductos.getProducts();
    socket.emit('products', productos);
    socket.on('updateRequest', async () => {
        const productos = await manejoProductos.getProducts();
        socket.emit('products', productos);
    });
    const messages = await messageManager.getMessages();
    socket.emit('messages', messages);
    socket.on('new-message', async () => {
        const messages = await messageManager.getMessages();
        socket.emit('messages', messages);
    });
});