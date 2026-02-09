import ChatRoom from "@/src/components/chat/ChatRoom";

export default function ChatPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const roomId = searchParams.roomId;
  const currentUser = searchParams.currentUser;
  const targetUser = searchParams.targetUser;

  if (!roomId || !currentUser || !targetUser) {
    return <div>Không có dữ liệu chat</div>;
  }

  return (
    <ChatRoom
      roomId={roomId}
      currentUser={JSON.parse(currentUser)}
      targetUser={JSON.parse(targetUser)}
    />
  );
}
