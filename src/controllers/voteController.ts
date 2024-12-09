import {Post, User, Comment} from "@prisma/client";
import database from "../database.js";

type Vote = "Like" | "Dislike";

export class VoteController{

static async voteCreatorPost(vote:{Vote: Vote, user: User, post: Post,}){
    // Mappa il tipo di voto a un valore numerico: 1 per "upvote", -1 per "downvote", 0 come default
    const voteValue = { Like: 1, Dislike: -1 }[vote.Vote] ?? 0;

    await database.vote.upsert({
        where: {
            voterUsername_votePostId: {
                voterUsername: vote.user.username,
                votePostId: vote.post.idPost
            },
        },
        create: {
            type: voteValue,
            voter: {
                connect: { username: vote.user.username }
            },
            postRel: {
                connect: {idPost: vote.post.idPost}
            },
        },
        update: {
            type: voteValue,
        },
    })
}


static async voteCreatorComment(vote:{Vote: Vote, user: User, comment: Comment}){

    const voteValue = { Like: 1, Dislike: -1 }[vote.Vote] ?? 0;

    await database.voteComment.upsert({
        where: {
            voterComUsername_commentId:{
                voterComUsername: vote.user.username,
                commentId: vote.comment.idComment
            }
        },
        create: {
            type: voteValue,
            voter: {
                connect: { username: vote.user.username }
            },
            commentRel: {
                connect: {idComment: vote.comment.idComment}
            },
        },
        update: {
            type: voteValue,
        },
    })
}


static async removeVoteFromPost(vote:{user: User, post: Post}){
    await database.vote.delete({
        where: {
            voterUsername_votePostId: {
                voterUsername: vote.user.username,
                votePostId: vote.post.idPost
            }
        }
    })
}


static async removeVoteFromComment(vote:{user: User, comment: Comment}){
    await database.voteComment.delete({
        where: {
            voterComUsername_commentId:{
                voterComUsername: vote.user.username,
                commentId: vote.comment.idComment
            }
        }
    })

}


static async getVotes(postId: number){
    const votes = await database.vote.findMany({
        where: {
            votePostId: postId
        }
    })
    return votes;
}


static async getCommentVotes(commentId: number){
    const votes = await database.voteComment.findMany({
        where: {
            commentId: commentId
        }
    })
    return votes;
}









































}