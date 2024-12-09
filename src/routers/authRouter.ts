import express from "express";
import { AuthController } from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const token = await AuthController.login({username, password});
        res.status(200).json(token);
    }
     catch(error) {
        res.status(401).json({message: "Username o password incorretti!"})
     }
})


authRouter.post("/registrazione", async (req, res) =>{
    try {
        const {username, password} = req.body;
        await AuthController.register({username, password});
        
        const token = AuthController.authToken(username);
        res.status(200).json(token);
    }
     catch (error){
        res.status(500).json({message: "C'e' stato un errore durante la creazione dell'accout!"})
     }
})