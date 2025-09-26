-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instrument_type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "styles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtistStyles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ArtistStyles_A_fkey" FOREIGN KEY ("A") REFERENCES "artists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArtistStyles_B_fkey" FOREIGN KEY ("B") REFERENCES "styles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ArtistInstruments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ArtistInstruments_A_fkey" FOREIGN KEY ("A") REFERENCES "artists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArtistInstruments_B_fkey" FOREIGN KEY ("B") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_name_key" ON "artists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "styles_name_key" ON "styles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistStyles_AB_unique" ON "_ArtistStyles"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistStyles_B_index" ON "_ArtistStyles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistInstruments_AB_unique" ON "_ArtistInstruments"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistInstruments_B_index" ON "_ArtistInstruments"("B");
