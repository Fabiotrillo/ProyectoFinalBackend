import express from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

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
import { LoggerRouter } from './routes/logger.router.js';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});

connectDB();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));
app.use(addLogger)
app.use(LoggerRouter)

app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url,
        ttl: 3600
    }),
    secret: "SecrectCode",
    resave: false,
    saveUninitialized: false
}));

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/api/users", UserRouter);
app.use("/", mockingRoutes)

inicializePassport();
app.use(passport.initialize());
app.use(passport.session());






