import { Router } from "express";
import ProductManager from "../dao/managersDB/ProductManager.js";
import CartManager from "../dao/managersDB/CartManager.js";
import { verifyEmailToken } from "../utils.js";
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
        

        res.render('products',  {products: productsResponse.msg});
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/carts", async (req,res)=>{
    const carts = await  cartmanager.getCartByID();
    res.render("carts")
})



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
    res.render('profile', { user: req.session.user });
});




export default router;