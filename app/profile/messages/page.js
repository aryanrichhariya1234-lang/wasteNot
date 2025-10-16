// app/profile/messages/page.js

import ChatWindow from "@/app/_components/ChatWindow";
import { getMessages, getMessagesForRoom } from "@/app/_lib/data-service";
import { getServerSupabaseClient } from "@/app/_lib/supabase";
import { getCanonicalRoomId } from "@/app/_utils/utils";
import Link from "next/link";

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

  // 2. Fetch and Deduplicate Chats
  const rawRecentChats = await getMessages(currentUserId);
  const uniqueChatsMap = new Map();
  rawRecentChats.forEach((chat) => {
    const partnerId = chat.otherUserId;
    if (!uniqueChatsMap.has(partnerId)) {
      uniqueChatsMap.set(partnerId, chat);
    }
  });
  let finalRecentChats = Array.from(uniqueChatsMap.values()); // Use let here to allow modification

  let initialMessages = [];
  let chatDisplayName = "Select a Chat";
  let canonicalRoomId = null;
  let targetUserId = null;
  let selectedChatObject = null;

  // 3. --- NEW LOGIC TO HANDLE INITIATING A NEW CHAT ---
  if (selectedChatId) {
    targetUserId = selectedChatId;
    canonicalRoomId = getCanonicalRoomId(currentUserId, selectedChatId);

    selectedChatObject = finalRecentChats.find(
      (chat) => chat.otherUserId === selectedChatId
    );

    // Check if the chat history was found in the recent list
    if (selectedChatObject) {
      chatDisplayName = selectedChatObject.name;
      initialMessages = await getMessagesForRoom(canonicalRoomId);
    } else {
      // SCENARIO: User clicked a provider/volunteer they've never messaged before.
      // We need to fetch the profile name/details for the targetId.

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", selectedChatId)
        .single();

      chatDisplayName = profileData?.name || `User ID: ${selectedChatId}`;

      // Create a temporary chat object for the sidebar and the ChatWindow
      const tempChatObject = {
        otherUserId: selectedChatId,
        name: chatDisplayName,
        latestMessage: "Start a new conversation!",
        // Add other necessary defaults
      };

      // Add the new conversation to the sidebar list so it appears selected
      finalRecentChats = [tempChatObject, ...finalRecentChats];

      // Since no messages exist, initialMessages remains empty ([]), which is correct.
    }
  }
  // ---------------------------------------------------

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

          {/* RENDER THE FINAL LIST (with new temp chat included if applicable) */}
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
                  {/* Display the latest message snippet */}
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
          {selectedChatId && canonicalRoomId ? (
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
