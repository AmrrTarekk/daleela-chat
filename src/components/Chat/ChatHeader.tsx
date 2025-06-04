import { logoutUser } from "@/service/userService";
import { LogOut, MessageSquare, Users } from "lucide-react";
import React from "react";

function ChatHeader() {
  return (
    <div className="bg-white shadow-sm border-b px-4 py-3 rounded-t-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Daleela Group Chat</h1>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {/* <span>
            {uniqueUsers > 0 ? `${uniqueUsers} users` : "No active users"}
          </span> */}
            </div>
          </div>
        </div>
        <button
          onClick={logoutUser}
          className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
