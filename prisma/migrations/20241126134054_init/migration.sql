-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "idPost" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "like" TEXT NOT NULL,
    "dislike" TEXT NOT NULL,
    "voter" TEXT NOT NULL,
    "votePostId" INTEGER NOT NULL,

    PRIMARY KEY ("voter", "votePostId"),
    CONSTRAINT "Vote_voter_fkey" FOREIGN KEY ("voter") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_votePostId_fkey" FOREIGN KEY ("votePostId") REFERENCES "Post" ("idPost") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "idComment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "postedOnId" INTEGER NOT NULL,
    CONSTRAINT "Comment_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_postedOnId_fkey" FOREIGN KEY ("postedOnId") REFERENCES "Post" ("idPost") ON DELETE RESTRICT ON UPDATE CASCADE
);
