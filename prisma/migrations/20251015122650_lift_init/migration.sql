/*
  Warnings:

  - You are about to drop the `_ArtistInstruments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistStyles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instruments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `styles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ArtistInstruments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ArtistStyles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "artists";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "instruments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "styles";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Lift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentFloor" INTEGER NOT NULL,
    "doorsOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ExternalCall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "floor" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liftId" TEXT,
    CONSTRAINT "ExternalCall_liftId_fkey" FOREIGN KEY ("liftId") REFERENCES "Lift" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "floor" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liftId" TEXT NOT NULL,
    CONSTRAINT "InternalRequest_liftId_fkey" FOREIGN KEY ("liftId") REFERENCES "Lift" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
