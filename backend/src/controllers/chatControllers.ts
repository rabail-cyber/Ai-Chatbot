import { NextFunction, Request, Response } from "express";
import user from "../models/user.js";
import { configureOpenAI } from "../config/openAiConfig.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";

export const generateChatCompletion = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    )=>{
    const {message} = req.body;
    try{
        const User= await user.findById(res.locals.jwtData.id); 
        if(!User)
        return res.status(401).json({message: "User not registered or Token malfunctioned"});
    //grab chats of user
    const chats = User.chats.map(({role,content})=>({
        role,
        content
    })) as ChatCompletionRequestMessage[] 
    chats.push({content: message, role: "user"});
    User.chats.push({content: message, role: "user"});

    //send all chats with new one to openai Api
    const config= configureOpenAI();
    const openai=new OpenAIApi(config)
    
        //get latest response 
    const chatResponse= await openai.createChatCompletion({
        model: "gpt-3.5-turbo", 
        messages: chats
    });
    
    User.chats.push(chatResponse.data.choices[0].message);
    await User.save();
    return res.status(200).json({chats: User.chats});

    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Something went wrong"})
    }        
};

export const sendChatsToUser=async(
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
        return res.status(200).json({message: "OK", chats: User.chats});
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message})
    }
};
export const deleteChats=async(
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
        //@ts-ignore
        User.chats = [];
        await User.save();
        return res.status(200).json({message: "OK"})
    }catch(error){
        console.log(error)
        return res.status(200).json({message: "ERROR", cause: error.message})
    }
};

