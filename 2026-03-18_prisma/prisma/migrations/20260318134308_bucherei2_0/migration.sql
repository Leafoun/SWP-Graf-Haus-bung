/*
  Warnings:

  - The primary key for the `Ausleihen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ausleihen_id` on the `Ausleihen` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ausleihen" (
    "kunde_id" INTEGER NOT NULL,
    "exemplar_id" INTEGER NOT NULL,
    "ausleihdatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rueckgabedatum" DATETIME,

    PRIMARY KEY ("kunde_id", "exemplar_id"),
    CONSTRAINT "Ausleihen_kunde_id_fkey" FOREIGN KEY ("kunde_id") REFERENCES "Kunde" ("kunde_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ausleihen_exemplar_id_fkey" FOREIGN KEY ("exemplar_id") REFERENCES "Exemplar" ("exemplar_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ausleihen" ("ausleihdatum", "exemplar_id", "kunde_id", "rueckgabedatum") SELECT "ausleihdatum", "exemplar_id", "kunde_id", "rueckgabedatum" FROM "Ausleihen";
DROP TABLE "Ausleihen";
ALTER TABLE "new_Ausleihen" RENAME TO "Ausleihen";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
