-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Interest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'MEDIUM',
    "waiting" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interest_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Interest" ("createdAt", "id", "level", "showId", "userId") SELECT "createdAt", "id", "level", "showId", "userId" FROM "Interest";
DROP TABLE "Interest";
ALTER TABLE "new_Interest" RENAME TO "Interest";
CREATE INDEX "Interest_userId_idx" ON "Interest"("userId");
CREATE UNIQUE INDEX "Interest_userId_showId_key" ON "Interest"("userId", "showId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
