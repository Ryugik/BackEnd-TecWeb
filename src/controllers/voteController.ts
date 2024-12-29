import { Post, User, Comment } from "@prisma/client";
import database from "../database.js";

export class VoteController {
  static async votePostCreator(vote: { type: number; user: User; post: Post }) {
    await database.vote.upsert({
      where: {
        voterUsername_votePostId: {
          voterUsername: vote.user.username,
          votePostId: vote.post.idPost,
        },
      },
      create: {
        type: vote.type,
        voter: {
          connect: { username: vote.user.username },
        },
        postRel: {
          connect: { idPost: vote.post.idPost },
        },
      },
      update: {
        type: vote.type
      },
    });






  }


  static async voteCommentCreator(vote: { type: number; user: User; comment: Comment }) {
    await database.voteComment.upsert({
      where: {
        voterComUsername_commentId: {
          voterComUsername: vote.user.username,
          commentId: vote.comment.idComment,
        },
      },
      create: {
        type: vote.type,
        voter: {
          connect: { username: vote.user.username },
        },
        commentRel: {
          connect: { idComment: vote.comment.idComment },
        },
      },
      update: {
        type: vote.type,
      },
    });
  }


  static async removeVotePost(vote: { user: User; post: Post }) {
    await database.vote.delete({
      where: {
        voterUsername_votePostId: {
          voterUsername: vote.user.username,
          votePostId: vote.post.idPost,
        },
      },
    });
  }


  static async removeVoteComment(vote: { user: User; comment: Comment }) {
    await database.voteComment.delete({
      where: {
        voterComUsername_commentId: {
          voterComUsername: vote.user.username,
          commentId: vote.comment.idComment,
        },
      },
    });
  }
  

  static async getUserVotePost(user: {postId: number, username: string}) {
    const vote = await database.vote.findFirst({
      where: {
          voterUsername: user.username,
          votePostId: user.postId,
      },
    });
    return vote;
  }


  static async getVotes(postId: number) {
    const votes = await database.vote.findMany({
      where: {
        votePostId: postId,
      },
    });
    return votes;
  }
  

  static async getCommentVotes(commentId: number) {
    const votes = await database.voteComment.findMany({
      where: {
        commentId: commentId,
      },
    });
    return votes;
  }
}