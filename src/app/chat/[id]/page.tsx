import ChatRoom from "@/src/components/chat/ChatRoom";

const Chat = () => {
  const roomId = "room123"; 
  const currentUser = {
    id: 1,
    firstName: "Trường",
    lastName: "Trần",
    type: "student" as const
  };
  const targetUser = {
    id: 2,
    firstName: "One",
    lastName: "Teacher",
    type: "teacher" as const
  };

  return (
    <ChatRoom
      roomId={roomId}
      currentUser={currentUser}
      targetUser={targetUser}
    />
  );
};

export default Chat;
