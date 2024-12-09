import express from "express";
import { json } from "stream/consumers";
import { forcedAuth, forcedPostAuth } from "../middleware.js";
import { Post } from "@prisma/client";
import { PostController } from "../controllers/postController.js";
import { AuthController } from "../controllers/authController.js";
import { VoteController } from "../controllers/voteController.js";
import { CommentController } from "../controllers/commentController.js";

export const postRouter = express.Router();

//cerca
postRouter.get("/posts", async (req, res) => {
    try {
        const maxAge = req.query;
        let startingDate: Date | null = null;
        if (maxAge !== undefined) {
            const dateOffset = 24 * 60 * 60 * 1000 * Number(maxAge);
            if (isNaN(dateOffset) || dateOffset < 0) {
                return res.status(400).json({ message: "Richiesta non valida: maxAge deve essere un numero positivo." });
            }
            startingDate = new Date(Date.now() - dateOffset);
        }

        const foundPosts = await PostController.getPostPosts(startingDate);

        const postsWithVotes = await Promise.all(
            foundPosts.map(async (post) => {
                const tally = await PostController.voteCounter(post);
                return { ...post, ...tally };
            })
        );

        res.status(200).json(postsWithVotes);
    } catch (error) {
        res.status(500).json({ message: "Errore interno del server.", error: error.message });
    }
});

