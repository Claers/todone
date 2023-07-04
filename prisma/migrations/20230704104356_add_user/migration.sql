-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "markdownDescription" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "taskStatusId" INTEGER,
    "dueDate" DATETIME,
    "estimatedDuration" INTEGER,
    "durationTypeId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    CONSTRAINT "Task_taskStatusId_fkey" FOREIGN KEY ("taskStatusId") REFERENCES "TaskStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_durationTypeId_fkey" FOREIGN KEY ("durationTypeId") REFERENCES "DurationType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "description", "done", "dueDate", "durationTypeId", "estimatedDuration", "id", "markdownDescription", "order", "taskStatusId", "title", "updatedAt") SELECT "createdAt", "description", "done", "dueDate", "durationTypeId", "estimatedDuration", "id", "markdownDescription", "order", "taskStatusId", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
