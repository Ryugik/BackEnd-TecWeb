import { Post, User } from "@prisma/client";
import database from "../database.js";

type Vote = "Like" | "Dislike";

export class VoteController{

static async voteCreatorPosts(vote:{Vote: Vote, user: User, post: Post,}){
    // Mappa il tipo di voto a un valore numerico: 1 per "upvote", -1 per "downvote", 0 come default
    const voteValue = { Like: 1, Dislike: -1 }[vote.Vote] ?? 0;

    const newVote = await database.vote.upsert({
        where: {
            voterForPostId: {
                voter: vote.user.username,
                postId: vote.post.idPost
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









































}