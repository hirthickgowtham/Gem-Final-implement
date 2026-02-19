import jwt from "jsonwebtoken"

const Verify_Token = (req,res,next) =>{

    const token = req.cookies.adminToken;

    if(!token){
        return res.status(401).json({
            message: "Access denied. No token found."
        });
    }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};




export default {Verify_Token};