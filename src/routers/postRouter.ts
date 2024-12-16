import express from "express";
import { json } from "stream/consumers";
import { forcedAuth, forcedPostAuth } from "../middleware.js";
import { Post } from "@prisma/client";
import { PostController } from "../controllers/postController.js";
import { AuthController } from "../controllers/authController.js";
import { VoteController } from "../controllers/voteController.js";
import { CommentController } from "../controllers/commentController.js";

export const postRouter = express.Router();

postRouter.get("/posts", async (req, res) => {
    try { 
        //se maxage non e' nella query startingDate rimane rull, restituisce tutti i post
        let startingDate: Date | null = null;

        if (req.query.maxAge !== undefined) {

            const maxAge = Number(req.query.maxAge);
            if (isNaN(maxAge) || maxAge < 0) {
                res.status(400).json({ message: "Inserire una data valida!" });
            }
            //una settimana, basta cambiare il 7 per avere giorni diversi!
            const offset = maxAge * (7 * 24 * 60 * 60 * 1000); 
            startingDate = new Date(Date.now() - offset);
            await PostController.getPostPosts(startingDate);
        } else{
            await PostController.getPriorPosts();
        }
    } catch (error) {
        res.status(500).json({ message: "Richiesta non valida!"});
    }

// ci manca qualcosa?


});


postRouter.get("/posts", forcedAuth, async (req, res) => {
    let post = req.body
    const user = await AuthController.searchUsername(post.username)

    post.authorUsername = user;
    
    if(PostController.checkForErrors(post)){
        PostController.postCreator(post);
        res.status(200).json({message: "Post creato correttamente!"});
    } else {
        res.status(500).json({ message: "Richiesta non valida!"});
    }
});


postRouter.get("/posts/:id", async (req, res) => {
    try {
        const postId = Number(req.params.id);
        const foundPost = await PostController.getPostById(postId);

        if (isNaN(postId)) {
            res.status(400).json({ message: "ID post non corretto!" });
        }
        if (foundPost === null) {
            res.status(404).json({ message: "Post non trovato!" });
        }

        const count = await PostController.voteCounter(foundPost);
        // spread (...) estrae tutte le proprieta' dai due oggetti e le unisce in uno singolo
        res.status(200).json({ ...foundPost, ...count });
    } catch (error) {
        res.status(500).json({ message: "C'e' stato un errore, riprovare!"});
    }
});


postRouter.delete("/posts/:id", forcedAuth, forcedPostAuth, async (req, res) => {
    await PostController.postDestroyer(Number(req.params.id));
    res.status(200).json({message: "Post eliminato correttamente!"});

})