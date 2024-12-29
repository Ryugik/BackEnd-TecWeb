import express from "express";
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
        let foundPosts: Post[] = [];

        if (req.query.maxAge !== undefined) {

            const maxAge = Number(req.query.maxAge);
            if (isNaN(maxAge) || maxAge < 0) {
                res.status(400).json({ message: "Inserire una data valida!" });
            }
            //una settimana, basta cambiare il 7 per avere giorni diversi!
            const offset = maxAge * (7 * 24 * 60 * 60 * 1000); 
            startingDate = new Date(Date.now() - offset);

            foundPosts = await PostController.getPostPosts(startingDate);
            
            
        } else{
            foundPosts = await PostController.getPriorPosts();
        }
        res.status(200).json(foundPosts);
    } catch (error) {
        res.status(500).json({ message: "Richiesta non valida!"});
    }

// ci manca qualcosa?


});


postRouter.post("/posts", forcedAuth, async (req, res) => {
    let post = req.body
    
    const user = await AuthController.searchUsername(post.username, true);

    post.author = user;
    

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
        } else{
        const count = await PostController.voteCounter(foundPost);
            // spread (...) estrae tutte le proprieta' dai due oggetti e le unisce in uno singolo
        res.status(200).json({ ...foundPost, count });
        }
    } catch (error) {
        res.status(500).json({ message: "C'e' stato un errore, riprovare!"});
    }
});


postRouter.delete("/posts/:id", forcedAuth, forcedPostAuth, async (req, res) => {
    await PostController.postDestroyer(Number(req.params.id));
    res.status(200).json({message: "Post eliminato correttamente!"});

})


postRouter.get("/posts/:id/comments", async (req, res) => {
    const postId = Number(req.params.id);
    const comments = await CommentController.getComments(postId);
    res.status(200).json(comments);
});


postRouter.post("/posts/:id/comments", forcedAuth, async (req, res) => {
    const postId = Number(req.params.id);
    const comment = req.body;
    const user = await AuthController.searchUsername(req.body.username);
    comment.author = user;
    comment.postedOn = await PostController.getPostById(postId);

    if (CommentController.checkComment(comment)) {
        await CommentController.commentCreator(comment);
        res.status(200).json({ message: "Commento creato correttamente!" });
    } else {
        res.status(500).json({ message: "Richiesta non valida!" });
    }
});


postRouter.delete("/posts/:id/comments/:commentId", forcedAuth, async (req, res) => {
    const commentId = Number(req.params.commentId);
    await CommentController.commentDestroyer(commentId);
    res.status(200).json({ message: "Commento eliminato correttamente!" });
});


postRouter.post("/posts/:id/votes", forcedAuth, async (req, res) => {
  const postId = Number(req.params.id);
  const type = req.body.type;
  const user = await AuthController.searchUsername(req.body.username);
  const post = await PostController.getPostById(postId);

  if (post === null) {
    res.status(404).json({ message: "Post non trovato!" });
    return;
  }

  if (type !== 1 && type !== -1) {
    res.status(400).json({ message: "Richiesta non valida!" });
    return;
  }

  await VoteController.votePostCreator({ type, user, post });
  const count = await PostController.voteCounter(post);
  res.status(200).json({ message: "Voto inserito correttamente!", counter: count });
});


postRouter.delete("/posts/:id/votes", forcedAuth, async (req, res) => {
    const postId = Number(req.params.id);
    const user = await AuthController.searchUsername(req.body.username);
    const post = await PostController.getPostById(postId);
  
    if (post === null) {
      res.status(404).json({ message: "Post non trovato!" });
      return;
    }
  
    await VoteController.removeVotePost({ user, post });
    const count = await PostController.voteCounter(post);
    res.status(200).json({ message: "Voto eliminato correttamente!", counter: count });
  });


postRouter.get("/posts/:id/votes", async (req, res) => {
    const postId = Number(req.params.id);
    const post = await PostController.getPostById(postId);
    const votes = await VoteController.getVotes(postId);
    const counter = await PostController.voteCounter(post)
    res.status(200).json({ votes, counter });
});
