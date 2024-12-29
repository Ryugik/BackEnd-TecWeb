-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "type" INTEGER NOT NULL,
    "voterUsername" TEXT NOT NULL,
    "votePostId" INTEGER NOT NULL,

    PRIMARY KEY ("voterUsername", "votePostId"),
    CONSTRAINT "Vote_voterUsername_fkey" FOREIGN KEY ("voterUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_votePostId_fkey" FOREIGN KEY ("votePostId") REFERENCES "Post" ("idPost") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("type", "votePostId", "voterUsername") SELECT "type", "votePostId", "voterUsername" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
