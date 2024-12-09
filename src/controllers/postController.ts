import {User, Post} from "@prisma/client";
import database from "../database.js";
import { VoteController } from "./voteController.js";
import { CommentController } from "./commentController.js";


const maxLengthTitle = 300;
const maxLengthDescription = 10000;


export class PostController {
//checks for misuse, if none returns true else an error array
static checkForErrors(post: {title: string, description: string, author: User}): true| string[]{
    
    let error: string[] =  [];

    //try so that error gets caught
    try{
        if (post.title.length > maxLengthTitle){
            error.push(`Il titolo non puo' superare i ${maxLengthTitle} caratteri!`);
        }

        if (post.title.length === 0) {
            error.push("Inserire un titolo!");
        }

        if (post.description.length > maxLengthDescription){
            error.push(`La descrizione non puo' superare i ${maxLengthDescription} caratteri!`);
        }

        if(error.length === 0){
            return true;
        }
    }
     catch(error){
        error.push("I campi non sono stati compilati correttamente!");
        return error;
    }
}


//saves post into database
static async postCreator(post: {title: string, description: string, author: User}){
    await database.post.create({
        data:{
            title: post.title, 
            description: post.description,
            creatorPost: {
                connect: { username: post.author.username } 
              }
        }
    })
}


//deteles post with its comments and votes from database
static async postDestroyer(id: number){
    const deletePost = database.post.delete({
        where:{
            idPost: id
        }
    })

    const deleteComments = database.comment.deleteMany({
        where:{
            idComment: id,
        }
    })

    const deleteVotes = database.vote.deleteMany({
        where: {
            votePostId: id
        }
    })

    await database.$transaction([deletePost, deleteComments, deleteVotes]);
}


//gets all posts at a set date
static async getAllPosts(Date: Date | null = null, postAuthor = true, postVotes = true, postComments = true){

    let searchVariables = {
        author: postAuthor,
        votes: postVotes,
        comments: postComments
    };

    let post;
    if (Date === null){
        post = await database.post.findMany({
            include: searchVariables
        })
    } else {
        post = await database.post.findMany({
            include: searchVariables,
            where: {
                createdAt: {
                    equals: Date
                }
            }
        })
    }

    return post;
}


//gets all posts prior to a set date
static async getPriorPosts(Date: Date | null = null, postAuthor = true, postVotes = true, postComments = true){

    let searchVariables = {
        author: postAuthor,
        votes: postVotes,
        comments: postComments
    };

    let post;
    if (Date === null){
        post = await database.post.findMany({
            include: searchVariables
        })
    } else {
        post = await database.post.findMany({
            include: searchVariables,
            where: {
                createdAt: {
                    lte: Date
                }
            }
        })
    }
    return post;
}


//gets all posts post to a set date kekw name
static async getPostPosts(Date: Date | null = null, postAuthor = true, postVotes = true, postComments = true){

    let searchVariables = {
        author: postAuthor,
        votes: postVotes,
        comments: postComments
    };

    let post;
    if (Date === null){
        post = await database.post.findMany({
            include: searchVariables
        })
    } else {
        post = await database.post.findMany({
            include: searchVariables,
            where: {
                createdAt: {
                    gte: Date
                }
            }
        })
    }
    return post;
}


//search post by id
static async getPostById(id: number){
    const postFound = await database.post.findUnique({
        where: {
            idPost: id
        },
        include: {
            creatorPost: true
        }
    })

    return postFound;
}

static async voteCounter(post: Post){

    const votes = await VoteController.getVotes(post.idPost);
        let counter = {
            likes: 0,
            dislikes: 0
        }

        for (let vote of votes){
            if (vote.type === 1){
                counter.likes = counter.likes + 1;
            } else {
                counter.dislikes = counter.dislikes +1;
            }
        }

        return counter;
    }



static async commentCounter(post: Post){

    const comments = await CommentController.getComments(post.idPost);

    return comments.length;

}


}