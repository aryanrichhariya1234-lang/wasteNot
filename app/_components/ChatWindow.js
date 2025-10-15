// app/_components/ChatWindow.js

"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabaseClient } from "../_lib/supabaseClient";
import { getCanonicalRoomId } from "../_utils/utils";
import Spinner from "./Spinner";

export default function ChatWindow({
  currentUserId,
  initialMessages, // Contains ONLY the messages for the current conversation
  targetUserId, // The ID of the person you are talking to
}) {
  // Rely entirely on the server-fetched data + real-time updates
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const chatBottomRef = useRef(null);

  // CRITICAL FIX: Generate the Room ID using the current user and the selected partner
  const chatRoomId = getCanonicalRoomId(currentUserId, targetUserId);

  // 1. Realtime Subscription and Cleanup
  useEffect(() => {
    if (!chatRoomId) return;

    // Reset messages when the chat partner changes (or component mounts)
    // We rely on the initialMessages prop for the first load
    setMessages(initialMessages || []);

    const channel = supabaseClient
      .channel(`chat-room-${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          // This is the ONLY place where new messages are added to state.
          setMessages((prev) => {
            // Basic deduplication check
            if (prev.some((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    // Cleanup: Unsubscribe when the component unmounts
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [chatRoomId, initialMessages]); // Dependency on initialMessages ensures re-render if server prop changes

  // 2. Auto-Scroll Effect
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log(targetUserId);

  // 3. Sending Messages (No Optimistic Update)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      chat_room_id: chatRoomId,
      sender_id: currentUserId,
      content: newMessage,
      receiver_id: targetUserId,
    };

    // The message is inserted into the database here.
    const { error } = await supabaseClient.from("messages").insert([message]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      // The message will now appear via the Realtime subscription (the useEffect above).
      setNewMessage(""); // Only clear the input field
    }
  };

  if (!messages) return <Spinner />;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl">
      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-xs rounded-xl ${
                msg.sender_id === currentUserId
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {/* Scroll Anchor */}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-4 border-t flex space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          disabled={!currentUserId || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
