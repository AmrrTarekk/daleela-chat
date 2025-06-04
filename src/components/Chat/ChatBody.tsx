import { useAuth } from "@/context/AuthContext";
import { db } from "@/service/firebase";
import { deleteMessage } from "@/service/userService";
import { formatDistanceToNow } from "date-fns";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function ChatBody() {
  const { user } = useAuth();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          text: data.text,
          userId: data.userId,
          userPhone: data.userPhone,
          timestamp: data.timestamp,
          createdAt: data.timestamp?.toDate() || new Date(),
        });
      });
      setMessages(messagesData);
      setInitialLoad(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isMyMessage = (message: Message) => {
    return message.userId === user?.uid;
  };

  const getDisplayedName = (phoneNumber: string) => {
    if (!phoneNumber) return "User";
    return phoneNumber.slice(-2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {initialLoad ? (
        <div className="text-center text-gray-500 mt-20">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              isMyMessage(message) ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isMyMessage(message)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              {!isMyMessage(message) && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {getDisplayedName(message.userPhone)}
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {message.userPhone}
                  </span>
                </div>
              )}
              <p className="break-words">{message.text}</p>
              <div
                className={`flex items-center justify-between mt-1 ${
                  isMyMessage(message) ? "text-blue-100" : "text-gray-500"
                }`}
              >
                <span className="text-xs">
                  {message.timestamp &&
                    formatDistanceToNow(message.createdAt, {
                      addSuffix: true,
                    })}
                </span>
                {isMyMessage(message) && (
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="ml-2 p-1 hover:bg-blue-700 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatBody;
