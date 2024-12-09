import {Post, User} from "@prisma/client"
import database from "../database.js"

const maxCommentLength = 3333;


export class CommentController{

    //checks if a comment meets length requirements, if no errors returns true else an error array
    static checkComment(comment: {body: string, author: User, postedOn: Post}): true | string[] {

        let error: string[] = [];

        try{
            if (comment.body.length > maxCommentLength){
                error.push(`Il commento non puo' superare i ${maxCommentLength} caratteri!`);
            }
    
            if (comment.body.length === 0 || comment.body === ""){
                error.push("Non puoi inviare un commento vuoto!");
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


    //creates comment in the post
    static async commentCreator(comment: {body: string, author: User, postedOn: Post}){
        await database.comment.create({
            data:{
                body: comment.body, 
                authorComment: {
                    connect: {username: comment.author.username}
                },
                postedOn:{
                    connect: {idPost: comment.postedOn.idPost}
                }
                }
            }
        )
    }


    //deteles comment from database
    static async commentDestroyer(id: number){
        await database.comment.delete({
            where:{
                idComment: id
            }
        })
    }

    //get ya comments son + test con operatore ternario
    static async getComments(postId: number, commentAuthor = true, commentedOn = false,) {

        const comments = await database.comment.findMany({
            include: { //true se commentauthor/commentedon true else undef
                        //(metto undef perche' prisma ignora i valori undef. questo evita errori)
                authorComment: commentAuthor ? true : undefined,
                postedOn: commentedOn ? true : undefined,
            },
            where: {
                postedOnId: postId
            }
        })
        
        return comments;
    }










































}


