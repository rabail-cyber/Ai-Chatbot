import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { Cookie_Name } from "./constant.js";
export const createToken=(id:string, email:string, expiresIn:string )=>{
    const payload= {id, email};
    const token= jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn,
    })
    return token;
};

export const verifyToken= async (
    req: Request, 
    res: Response, 
    next: NextFunction
    )=>{
        const token = req.signedCookies[`${Cookie_Name}`];
        if(!token || token.trim()===""){
            return res.status(401).json({message: "Token not received"});
        };
        return new Promise<void>((resolve, reject)=>{
            return jwt.verify(token, process.env.JWT_SECRET, (err, success)=>{
                if(err){
                    reject(err.message);
                    return res.status(401).json({message:"Token is expired"});
                }else {
                    resolve()
                    res.locals.jwtData = success;
                    return next();
                };
            });
        });
    };