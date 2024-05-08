import express from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js'
import sessionRouter from './routes/sessions.router.js'
import inicializePassport from './config/passport.config.js';
import {config} from "./config/config.js"
import { connectDB } from './config/connectDB.js';
import {ProductRouter} from './routes/products.router.js'
import {CartRouter} from './routes/carts.router.js'
import { UserRouter } from './routes/users.router.js';
import { mockingRoutes } from './routes/mock.router.js';
import { addLogger } from './utils/logger.js';


const PORT = config.server.port || 8080

const MONGO_URL = config.mongo.url


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const HttpServer = app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});

const io = new Server(HttpServer);
io.on("connection", socket =>{

    console.log('Nuevo cliente conectado');
    socket.on('productRemoved', ({ cartId, productId }) => {
        // Realizar la lógica para eliminar el producto del carrito
        // Esto puede incluir la eliminación del producto de la base de datos, etc.
        // Una vez que el producto se ha eliminado con éxito, puedes emitir un evento para informar a todos los clientes conectados
        io.emit('productoEliminado', { cartId, productId });
    });

})

connectDB();


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.static('node_modules'));
app.use(addLogger)


app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url,
        ttl: 3600
    }),
    secret: "SecrectCode",
    resave: false,
    saveUninitialized: false
}));

inicializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/", viewsRouter);
app.use("/api/carts", CartRouter);
app.use("/api/products", ProductRouter);
app.use("/api/users", UserRouter);
app.use("/api/sessions", sessionRouter);






app.use("/", mockingRoutes)




export {app, io}



