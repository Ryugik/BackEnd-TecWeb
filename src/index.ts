import cors from "cors";
import 'dotenv/config';
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import { authRouter } from "./routers/authRouter";
import { postRouter } from "./routers/postRouter";


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

console.log("Server started");

app.use(authRouter);
app.use(postRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log dell'errore
    res.status(err.status || 500).json({
        code: err.status || 500,
        description: err.message || "Errore durante il processamento della richiesta",
    });
});




app.listen(process.env.PORT);