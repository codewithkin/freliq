-- CreateTable
CREATE TABLE "me" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "me_id_key" ON "me"("id");
