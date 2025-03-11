-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "sidebarOpen" BOOLEAN NOT NULL DEFAULT false,
    "lastPage" TEXT,
    "theme" TEXT,
    "bootstrapped" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_UserSettings" ("id", "lastPage", "sidebarOpen", "theme") SELECT "id", "lastPage", "sidebarOpen", "theme" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
