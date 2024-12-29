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
        if(req.body.username === "" || req.body.password === "") {
            res.status(401).json({message: "Richiesta non valida!"});
            return;
        }

        const user = await AuthController.searchUsername(req.body.username, true);
        if(user !== null){
            res.status(401).json({message: "Username gia' in uso."});
            return;
        }

        await AuthController.register({username: req.body.username, password: req.body.password});
        const token = AuthController.authToken(req.body.username);
        res.status(200).json(token);
    }
     catch (error){
        res.status(500).json({message: "C'e' stato un errore durante la creazione dell'accout!"})
     }
})


authRouter.post("/logout", async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
});