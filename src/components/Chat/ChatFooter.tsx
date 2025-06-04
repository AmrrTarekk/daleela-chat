import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/service/userService";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { Send } from "lucide-react";
import React, { useState } from "react";

function ChatFooter() {
  const { user } = useAuth();
  const [addedMessage, setAddedMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await sendMessage({
        text: addedMessage,
        userId: user.uid,
        userPhone: user.phoneNumber || "",
        timestamp: serverTimestamp() as Timestamp,
      });
      setAddedMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t p-4 rounded-b-[20px]">
      <form onSubmit={handleSendMessage} className="flex space-x-3">
        <input
          type="text"
          value={addedMessage}
          onChange={(e) => setAddedMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !addedMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:block">Send</span>
        </button>
      </form>
    </div>
  );
}

export default ChatFooter;
