"use client";

import { Loader2 } from "lucide-react";
import { auth } from "@/service/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "@/components/Chat";
import Login from "@/components/Login";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col h-screen p-10">
        <Chat />
      </div>
    );
  }

  return <Login />;
}
