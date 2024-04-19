import { Router } from "express";
import userModel from "../dao/db/models/users.model.js";
import ProductManager from "../dao/managersDB/ProductManager.js";
import { createHash, generateEmailToken, validatePassword } from "../utils.js";
import passport from "passport";
import {  CreateUsersDto, GetUserDto } from "../dao/dto/users.dto.js";
import { verifyEmailToken } from "../utils.js";
import { sendRecoveryPass } from "../services/mailingService.js";


const router = Router();
const manager = new ProductManager();

//register user
router.post("/register",passport.authenticate("register", {failureRedirect:"/register/failregister"}),

async (req,res) => {

    res.send({status:"success", message:"User registrado"})
})

router.get("/failregister", async (req,res)=>{

    console.log('Fallo el registro');

    res.send({error: 'fallo en el registro'})

})


// Login de un Usuario
router.post('/login', passport.authenticate("login", {failureRedirect:'/api/sessions/faillogin'}),
async (req,res) =>{

   

    if(!req.user){
        return res.status(400).send({
            status: "Error",
            message: "No se ha podido autenticar al usuario."
        })
    }
    req.session.user = {
        id : req.user._id,
        first_name: req.user.first_name,
        FullName:`${req.user.first_name} ${req.user.last_name}`,
        last_name:req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role:req.user.role,

    }
    const productsResponse = await manager.getProducts();
    req.session.products = productsResponse.msg;

    res.send({
        status:"success", payload:req.user
    })
}

)
router.get('/faillogin', (req,res)=>{
    res.send({error:"Fail login"})
})


//login con github
router.get('/github', passport.authenticate('github',{scope:['user:email']}),
async(req,res)=>{}
);

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),
async(req,res)=>{
    req.session.user= req.user;
    res.redirect('/')
}
);


//logout user
router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status:"Error",
                message:"No se pudo cerrar sesion."
            })
        }
        res.redirect('/login')
    })
})

//reset password

router.post("/forgotpassword", async(req,res)=>{
    try {
        const {email} = req.body;
       const user = await userModel.findOne({email})
        if(!user){
            res.send("Error no existe el usuario")
        }
        const token = generateEmailToken(email,10000)
        await sendRecoveryPass(email,token)
        

        res.send('Se ha enviado un correo para restablecer contraseña')

    } catch (error) {
        res.send("error")
    }
});



router.post('/resetpassword', async (req,res)=>{
    const token = req.query.token
   
     const {email,newPassword}  = req.body;  
     
     const validToken = verifyEmailToken(token)


     if(!validToken){
        return  res.status(401).json({
                    status:"Error",
                    msg: 'Invalid Token'
               });  
     }
    

     if(!email || !newPassword) return res.status(400).send({
        status:"Error",
        message: "Datos incorrectos"
     })
    
     const user = await userModel.findOne({email});
     if (!user) return res.status(404).send({
        status:"Error nuevo",
        message:"El usuario no existe"
     })

     if(validatePassword(newPassword,user)){
        return res.send("no se puede usar la misma contraseña")
    }

    const userData = {
        ...user._doc,
        password:createHash(newPassword)
    }

    const updateUser = await userModel.findOneAndUpdate({email},userData);

    res.render("login", {message:"Contraseña actualizada"})


});

router.get('/current', (req, res) => {
    if (req.session && req.session.user) {
        let user = req.user;
        if (!user){
            res.send({
                status: "error",
                msg: "No hay usuario activo",
              })
        }
       
    const userDto = new GetUserDto(req.session.user);
      res.send({ status: 'success', payload: userDto });
    } else {
      res.status(401).send({ status: 'error', message: 'Usuario no autenticado' });
    }
  });

export default router;