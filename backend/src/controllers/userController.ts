import { NextFunction, Response, Request } from "express";
import user from "../models/user.js"
import {hash, compare} from "bcrypt"
import { createToken } from "../utils/tokenManager.js";
import { Cookie_Name } from "../utils/constant.js";

export const getAllUsers= async(
    req:Request, 
    res:Response, 
    next: NextFunction
    ) => {
    try{
        //get all users
        const users = await user.find();
        return res.status(200).json({message: "ok", users});
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
}

export const userSignup=async(
    req:Request, 
    res:Response, 
    next: NextFunction
    )=>{
    try{
        // user signup
        const {name, email, password}=req.body;
        const existingUser= await user.findOne({email});
        if (existingUser) return res.status(401).send("User is already registered")
        const hashedPassword= await hash(password,10);
        const User=new user({name, email, password: hashedPassword});
        await User.save()
        // create token and store cookie
        res.clearCookie(Cookie_Name,{
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        })

        const token=createToken(User._id.toString(), User.email, "7d")
        const expires= new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(Cookie_Name, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res
        .status(201)
        .json({message: "ok", name: User.name, email: User.email});
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message})
    };
};

export const userLogin=async(
    req:Request, 
    res:Response, 
    next: NextFunction
    ) => {
    try{   
        const {email, password}=req.body;
        const User=await user.findOne({email});
        if (!User) {
            return res.status(401).send("User not registered")
        }
        const isPasswordCorrect= await compare(password, User.password);
        if(!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        // create token and store cookie
        res.clearCookie(Cookie_Name,{
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        })

        const token=createToken(User._id.toString(), User.email, "7d")
        const expires= new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(Cookie_Name, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res
        .status(200)
        .json({message: "user LoggedIn", name: User.name, email: User.email})
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message})
    }
};

export const verifyUser=async(
    req:Request, 
    res:Response, 
    next: NextFunction
    ) => {
    try{   
        const User=await user.findById(res.locals.jwtData.id);
        if (!User) {
            return res.status(401).send("User not registered or token malfunctioned");
        }

        if (User._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permission didn't match")

        }
        return res
        .status(200)
        .json({message: "user LoggedIn", name: User.name, email: User.email})
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message})
    }
};
export const userLogout=async(
    req:Request, 
    res:Response, 
    next: NextFunction
    ) => {
    try{   
        const User=await user.findById(res.locals.jwtData.id);
        if (!User) {
            return res.status(401).send("User not registered or token malfunctioned");
        }

        if (User._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permission didn't match")
        }

        res.clearCookie(Cookie_Name, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });
        return res
        .status(200)
        .json({message: "ok", name: User.name, email: User.email})
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message});
    };
};