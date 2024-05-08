import { Router } from "express";
import ProductManager from "../dao/managersDB/ProductManager.js";
import { UserService } from "../repository/index.js";
import CartManager from "../dao/managersDB/CartManager.js";
import { verifyEmailTokenMW } from "../midlewares/auth.js";




const router = Router()
const manager = new ProductManager();
const cartmanager = new CartManager();


const publicAccess = (req,res,next) =>{
    if(req.session.user){
        return res.redirect("/");    
    }
    next();
}

const privateAccess = (req,res,next) =>{
    if(!req.session.user){
        return res.redirect('/login');  
    }
    next();
}

router.get('/products', privateAccess, async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query} = req.query

        
        const productsResponse = await manager.getProducts(limit, page, sort, category, availability, query);
        const products = productsResponse.msg;


        

        res.render('products',   {products, user:req.session.user});
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/carts", privateAccess, async (req, res) => {
    try {
        const cartId = req.user.cart;
        
        // Verificar si el usuario tiene un carrito asignado
        if (!cartId) {
            return res.render("carts", { cart: null, products: [] });
        }
        

        // Obtener el carrito desde la base de datos utilizando el ID
        const cart = await cartmanager.getCartByID(cartId);
         let total = 0;
        if (cart.products.length > 0) {
            // Calcular el nuevo total del carrito después de eliminar el producto
            cart.products.forEach(item => {
                if (item.product && item.product.price && !isNaN(item.quantity)) {
                    total += item.product.price * item.quantity;
                }
            });
        }
        // Renderizar la vista "carts" pasando el carrito como contexto de datos
        res.render("carts", { cart, total });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/register", publicAccess,  (req,res)=>{
    res.render("register");
})



router.get("/login", publicAccess, (req,res)=>{
    res.render("login");
})

router.get("/", privateAccess, (req,res)=>{
    res.render("products",{user:req.session.user,  products:req.session.products})
})


router.get('/forgotpassword', (req,res)=>{
    res.render("forgotpassword")
})

router.get('/resetpassword',verifyEmailTokenMW(), (req,res)=>{
    const  token= req.query.token;
    res.render("resetpassword", {token})
})

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', { 
        user: { 
            ...req.session.user, // Copia todas las propiedades del usuario existente
            profileImage: req.session.user.profileImage // Agrega la propiedad profileImage al usuario
        } 
    });
});

router.get('/upload-documents', privateAccess,(req, res) => {
    res.render('uploadDocuments');
});

  router.get('/create-product', (req, res) => {
    res.render('createProducts');
});

router.get('/admin', async (req,res)=>{
    const users = await UserService.getUsers();
    if(!users){
        return next(new Error("No se pudo obtener los usuarios"));
    }
    const mainUser = req.session.user

        res.render("admin", {mainUser: mainUser, users: users} );
})



export default router;