import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
const authiorizeMiddleware = async (req, res, next) => {
    const token = req.headers.token;
    if(!token){
        res.status(401).json({error:"No token, authorization denied"});
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    const resp = await UserModel.findById(userId.id);
    if(!resp){
        return res.status(401).json({error:"Token is not valid"});
    }
    if(!req.body)req.body = {};
    req.user = userId.id;
    next();
};

export default authiorizeMiddleware;