// app/profile/messages/page.js

import ChatWindow from "@/app/_components/ChatWindow";
import { getMessages, getMessagesForRoom } from "@/app/_lib/data-service";
import { getServerSupabaseClient } from "@/app/_lib/supabase";
import { getCanonicalRoomId } from "@/app/_utils/utils";
import Link from "next/link";

// Force dynamic rendering to ensure fresh chat lists and active session check
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MessagesPage({ searchParams }) {
  const selectedChatId = searchParams?.chat || null;

  // 1. Auth Check (Unchanged)
  const supabase = await getServerSupabaseClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();
  const currentUserId = supabaseUser?.id;

  if (!currentUserId) {
    return (
      <div className="p-8 text-center text-red-600">
        Authentication required to view messages.
      </div>
    );
  }

  // 2. Fetch sidebar data (list of unique chats - this may still contain duplicates from the server side)
  const rawRecentChats = await getMessages(currentUserId);

  // 3. --- FIX: GUARANTEED DEDUPLICATION ---
  const uniqueChatsMap = new Map();
  rawRecentChats.forEach((chat) => {
    // We assume 'otherUserId' is the unique partner ID you want to group by
    const partnerId = chat.otherUserId;

    // Use Map to only store the FIRST instance found for each partnerId.
    // If your getRecentChats function sorts by latest message, this keeps the latest one.
    if (!uniqueChatsMap.has(partnerId)) {
      uniqueChatsMap.set(partnerId, chat);
    }
  });

  const finalRecentChats = Array.from(uniqueChatsMap.values());
  // ----------------------------------------

  let initialMessages = [];
  let chatDisplayName = "Select a Chat";
  let canonicalRoomId = null;
  let targetUserId = null;
  let selectedChatObject = null;

  if (selectedChatId) {
    // 4. Find the selected chat's details from the DEDUPLICATED list
    selectedChatObject = finalRecentChats.find(
      (chat) => chat.otherUserId === selectedChatId
    );

    if (selectedChatObject) {
      targetUserId = selectedChatId;
      canonicalRoomId = getCanonicalRoomId(currentUserId, selectedChatId);
      chatDisplayName = selectedChatObject.name;

      // Fetch the specific message history for the selected room
      initialMessages = await getMessagesForRoom(canonicalRoomId);
    }
  }

  return (
    <div className="h-[80vh] flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Messages (Inbox)
      </h1>

      <div className="flex flex-grow bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl">
        {/* Left Pane: Conversation List (30% width) */}
        <div className="w-1/3 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4 bg-white border-b sticky top-0">
            <h2 className="font-semibold text-lg text-gray-800">
              Conversations
            </h2>
          </div>

          {/* RENDER THE DEDUPLICATED LIST */}
          {finalRecentChats.map((chat) => (
            <Link
              key={chat.otherUserId}
              href={`/profile/messages?chat=${chat.otherUserId}`}
              className={`flex items-center p-4 border-b hover:bg-gray-100 transition cursor-pointer ${
                chat.otherUserId === selectedChatId
                  ? "bg-green-50 border-l-4 border-green-600"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                  {chat.name ? chat.name[0] : "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{chat.name}</p>
                  {chat.latestMessage && (
                    <p className="text-xs text-gray-500 truncate w-40">
                      {chat.latestMessage}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Pane: Chat Window (70% width) */}
        <div className="w-2/3 flex flex-col">
          {selectedChatId && canonicalRoomId && targetUserId ? (
            <div className="flex flex-col flex-grow">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-800">
                  Chatting with: {chatDisplayName}
                </h3>
              </div>

              <ChatWindow
                key={selectedChatId}
                currentUserId={currentUserId}
                targetUserId={targetUserId}
                roomId={canonicalRoomId}
                initialMessages={initialMessages}
              />
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a conversation from the list to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
