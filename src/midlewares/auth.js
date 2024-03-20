import jwt from "jsonwebtoken";


export const checkRole = (roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.json({status:"error", message:"necesitas estar autenticado"});
        }
        if(!roles.includes(req.user.role.toUpperCase())){
            return res.json({status:"error", message:"no estas autorizado"});
        }
        next();
    }
}

export const verifyEmailTokenMW = () => {

    return (req,res,next) => {
        try {

            const jwtToken = req.query.token;
            const decoded = jwt.decoded(jwtToken);
            const expTime = decoded.exp * 1000;
            const expDate = new Date(expTime);
            const currentDate = new Date()

            if(currentDate > expDate){
                return res.json({status:"error", message:"Token vencido"})
            }
            
        } catch (error) {
            return res.json({status:"error", message: "Error en el token"})
        }
        next()
    }

}