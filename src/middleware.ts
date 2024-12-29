import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PostController } from "./controllers/postController.js";
import { CommentController } from "./controllers/commentController";
import { AuthController } from "./controllers/authController";

export function forcedAuth(req: Request, res: Response, next: NextFunction): null {
    
    const headerAuth = req.headers['authorization'];
    let decodedToken;
    if(!headerAuth) {
        next ({status: 401, message: "Non autorizzato!"})
        return;
    }

    try {
        decodedToken = AuthController.verifyToken(headerAuth) as JwtPayload;
    } 
     catch {
        next ({status: 401, message: "Non autorizzato!"})
    }

    req.body.username = decodedToken.user;
    next();
}


export async function forcedPostAuth(req: Request, res: Response, next: NextFunction) {

    try {
        const postId = Number(req.params.id);
        const user = await AuthController.searchUsername(req.body.username);
        const post = await PostController.getPostById(postId);

        if (!post) {
            return next({ status: 404, message: "Il post non è stato trovato."});
        }

        if (!user) {
            return next({ status: 404, message: "L'user non è stata trovato."});
        }

        if (post.author !== user.username) {
            return next({ status: 401, message: "Non autorizzato: l'utente non è il proprietario dell'idea."});
        }

        next()
    }
     catch {
        next({ status: 500, message: "Si è verificato un errore durante il controllo dell'autorizzazione."});
     }
}


