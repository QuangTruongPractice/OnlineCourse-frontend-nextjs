"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import db from '../../utils/firebaseConfigs';
import { ref, push, onValue } from "firebase/database";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}
type UserType = "student" | "teacher";

interface ChatRoomProps {
  roomId: string;
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    type: UserType;
  };
  targetUser: {
    id: number;
    firstName: string;
    lastName: string;
    type: UserType;
  };
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, currentUser, targetUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const messagesRef = ref(db, `chats/${roomId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = data
        ? Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
        : [];
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newMessage.trim()) {
      const msg = {
        senderId: currentUser.id,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      const messagesRef = ref(db, `chats/${roomId}`);
      push(messagesRef, msg);
      setNewMessage("");
    }
  };

  const handleQuickMessage = (message: string): void => {
    setNewMessage(message);
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarText = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const isCurrentUserMessage = (message: Message): boolean => {
    return Number(message.senderId) === currentUser.id;
  };

  const getSenderType = (message: Message): 'teacher' | 'student' => {
    if (Number(message.senderId) === currentUser.id) {
      return currentUser.type;
    }
    return currentUser.type === 'teacher' ? 'student' : 'teacher';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Chat Room</h1>
            <p className="text-blue-100">
              {currentUser.firstName} {currentUser.lastName} & {targetUser.firstName} {targetUser.lastName}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message: Message) => {
            const isCurrentUser = isCurrentUserMessage(message);
            const senderType = getSenderType(message);

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
              >
                {!isCurrentUser && (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 text-white font-medium ${senderType === 'teacher' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                    {getAvatarText(message.senderName)}
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${isCurrentUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                >
                  <div className={`font-medium text-sm mb-1 ${isCurrentUser ? 'text-blue-100' : (senderType === 'teacher' ? 'text-blue-600' : 'text-green-600')
                    }`}>
                    {isCurrentUser
                      ? (currentUser.type === 'teacher' ? 'Teacher' : 'Student')
                      : (senderType === 'teacher' ? 'Teacher' : 'Student')
                    }
                  </div>
                  <div>
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {isCurrentUser && (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 text-white font-medium ${currentUser.type === 'teacher' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                    {getAvatarText(message.senderName)}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <span className="text-xl">🚀</span>
            </button>
          </form>

          {/* Quick Messages */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {currentUser.type === 'teacher' ? (
              <>
                <button
                  onClick={() => handleQuickMessage('Hôm nay chúng ta sẽ học về...')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  📚 Bắt đầu bài học
                </button>
                <button
                  onClick={() => handleQuickMessage('Các em có câu hỏi gì không?')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  ❓ Hỏi đáp
                </button>
                <button
                  onClick={() => handleQuickMessage('Bài tập về nhà là...')}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  📝 Giao bài tập
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickMessage('Em có một câu hỏi ạ!')}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors"
                >
                  🙋‍♂️ Đặt câu hỏi
                </button>
                <button
                  onClick={() => handleQuickMessage('Em đã hiểu rồi ạ, cảm ơn thầy!')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  ✅ Đã hiểu
                </button>
                <button
                  onClick={() => handleQuickMessage('Em nộp bài tập ạ!')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  📤 Nộp bài
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;