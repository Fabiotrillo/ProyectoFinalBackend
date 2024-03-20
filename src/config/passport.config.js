import passport from "passport";
import local from "passport-local";
import userModel from "../dao/db/models/users.model.js";
import { createHash, validatePassword } from "../utils.js";
import CartManager from "../dao/managersDB/CartManager.js";
import githubstrategy from "passport-github2";


const localStrategy = local.Strategy;
const manager = new CartManager();

const inicializePassport = () => {



    passport.use("register", new localStrategy(

        { passReqToCallback: true, usernameField: "email" },

        async (req, username, password, done) => {

            const { first_name, last_name, age, email } = req.body;

            try {
                let user = await userModel.findOne({ email: username });

                if (user) {

                    console.log('Usuario ya registrado');

                    return done(null, false, { message: 'El usuario ya está registrado' })

                }
                let role="user"
                if (username.startsWith("fabiotrillo")) {
                    role = "admin";
                }

                // Crear un nuevo carrito para el usuario
                const newCart = await manager.createCarts([], 0);

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: role,
                    cart: newCart._id
                }

                const result = await userModel.create(newUser);
               

                return done(null, result);
                
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.use('login', new localStrategy({ usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });

                if (!user || !validatePassword(password, user)) {
                    return done(null, false);
                }

                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });


    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })

    passport.use('github', new githubstrategy({

        clientID: "Iv1.6d376c6b01d4b97d",

        clientSecret: "bd03003b598e8fc25919a6c3c83e4a9f45ca8e18",

        callbackURL: "http://localhost:8080/api/sessions/githubcallback"

    }, async (accesToken, refreshToken, profile, done) => {

        try {

            console.log(profile);



            let user = await userModel.findOne({ email: profile._json.email });

            if (user) {

                console.log('Usuario ya registrado');

                return done(null, false)

            }



            const newUser = {

                first_name: profile._json.name,

                last_name: "",

                email: profile._json.email,

                age: 18,

                password: ""

            }

            const result = await userModel.create(newUser);

            return done(null, result);



        } catch (error) {

            return done(error)

        }



    }))

}


export default inicializePassport;