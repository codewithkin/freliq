-- CreateTable
CREATE TABLE "_ChatRoomUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChatRoomUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChatRoomUsers_B_index" ON "_ChatRoomUsers"("B");

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
