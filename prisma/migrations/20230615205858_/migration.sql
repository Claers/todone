-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DurationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "multiplierFromBase" REAL NOT NULL DEFAULT 1
);
INSERT INTO "new_DurationType" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "DurationType";
DROP TABLE "DurationType";
ALTER TABLE "new_DurationType" RENAME TO "DurationType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
