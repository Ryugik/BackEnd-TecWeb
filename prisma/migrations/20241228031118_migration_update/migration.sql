/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dislike` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voter` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `type` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterUsername` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "VoteComment" (
    "idVoteComment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "voterComUsername" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    CONSTRAINT "VoteComment_voterComUsername_fkey" FOREIGN KEY ("voterComUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VoteComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("idComment") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "idPost" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "counter" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("author", "createdAt", "description", "idPost", "title") SELECT "author", "createdAt", "description", "idPost", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_Vote" (
    "type" INTEGER NOT NULL,
    "voterUsername" TEXT NOT NULL,
    "votePostId" INTEGER NOT NULL,

    PRIMARY KEY ("voterUsername", "votePostId"),
    CONSTRAINT "Vote_voterUsername_fkey" FOREIGN KEY ("voterUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_votePostId_fkey" FOREIGN KEY ("votePostId") REFERENCES "Post" ("idPost") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("votePostId") SELECT "votePostId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VoteComment_voterComUsername_commentId_key" ON "VoteComment"("voterComUsername", "commentId");
