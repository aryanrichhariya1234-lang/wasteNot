import { getServerSupabaseClient } from "./supabase";

export async function signUp(email, password, name) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}

export async function createProvider(providerData) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("providers")
    .insert([providerData])
    .select();
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}

export async function loginUser(role, email, password) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log(error);
    return { error };
  }

  return data;
}

export async function signOut() {
  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error };
  }
}

export async function createVolunteer(volunteerData) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("volunteers")
    .insert([volunteerData])
    .select();
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}

export async function uploadSampleData(sampleData) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(sampleData)
    .select();
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}

export async function getOrders() {
  const supabase = await getServerSupabaseClient();
  const { data: orders, error } = await supabase.from("orders").select("*");
  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}
export async function getVolunteerOrders(id) {
  const supabase = await getServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("volunteerId", id);
  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}
export async function getProviderOrders(id) {
  const supabase = await getServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("providerId", id);
  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}
export async function getAvailableOrders() {
  const supabase = await getServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("isDelivered", false);
  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}

export async function getOrder(id) {
  const supabase = await getServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id);

  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}

export async function editOrder({ id, updatedOrder }) {
  const supabase = await getServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .update(updatedOrder)
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}
export async function createNewOrder(order) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}

export async function getUserById(id) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id);
  if (error) {
    return;
  }

  return data;
}

// export async function getMessages(currentUserId) {
//   const supabase = await getServerSupabaseClient();
//   const { data: recentChatData, error: recentChatError } = await supabase
//     .from("messages")
//     .select("*")
//     .eq("sender_id", currentUserId);

//   if (recentChatError) {
//     console.log(recentChatError);
//     return;
//   }

//   const messages = await Promise.all(
//     recentChatData.map(async (receiver) => {
//       console.log(receiver.receiver_id);
//       const [sent, received, name] = await Promise.all([
//         supabase
//           .from("messages")
//           .select("created_at, content,sender_id")
//           .eq("sender_id", currentUserId)
//           .eq("receiver_id", receiver.receiver_id),
//         supabase
//           .from("messages")
//           .select("created_at, content,sender_id")

//           .eq("receiver_id", currentUserId)
//           .eq("sender_id", receiver.receiver_id),
//         supabase.from("profiles").select("name").eq("id", receiver.receiver_id),
//       ]);
//       const allMessages = [...(sent.data || []), ...(received.data || [])].sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at)
//       );
//       console.log(name);

//       return {
//         name: name?.data[0]?.name,
//         messages: allMessages,
//         receiver_id: receiver.receiver_id,
//       };
//     })
//   );
//   const uniqueProfiles = [
//     ...new Map(messages.map((p) => [p.receiver_id, p])).values(),
//   ];

//   return uniqueProfiles;
// }
// app/_lib/actions.js (New Function)

export async function getMessagesForRoom(roomId) {
  const supabase = await getServerSupabaseClient();

  // Fetch messages using the canonical room ID
  const { data: messages, error } = await supabase
    .from("messages")
    .select("created_at, content, sender_id")
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching room messages:", error);
    return [];
  }
  return messages;
}
// app/_lib/actions.js (Corrected and New Logic)

export async function getMessages() {
  const supabase = await getServerSupabaseClient();
  const currentUser = await supabase.auth.getUser();
  const currentUserId = currentUser.data.user.id;

  if (!currentUserId) return [];

  // 1. Fetch all messages involving the current user (requires RLS or a complex query)
  // For RLS to work, we'll rely on a dedicated RLS policy that checks the chat_room_id
  // The policy should be: (auth.uid() = SPLIT_PART(chat_room_id, '_', 1)) OR (auth.uid() = SPLIT_PART(chat_room_id, '_', 2))

  const { data: allMessages, error } = await supabase
    .from("messages")
    .select("chat_room_id, created_at, content, sender_id")
    .order("created_at", { ascending: false }); // Newest first

  if (error) {
    console.error("Error fetching all relevant messages:", error);
    return [];
  }

  // 2. Group messages by chat_room_id and find the ID of the 'other' user
  const recentChatsMap = new Map();
  console.log(allMessages);

  allMessages.forEach((msg) => {
    const roomId = msg.chat_room_id;

    if (recentChatsMap.has(roomId)) {
      // Only keep the most recent message (the first one encountered since we ordered by created_at DESC)
      return;
    }

    // Split room ID to find the other user
    const [id1, id2] = roomId.split("_");
    const otherUserId = id1 === currentUserId ? id2 : id1;

    // Store the unique conversation starter
    recentChatsMap.set(roomId, {
      roomId: roomId,
      otherUserId: otherUserId,
      latestMessage: msg.content,
      latestTimestamp: msg.created_at,
    });
  });

  // 3. Fetch all required profile names in a single, efficient query
  const userIdsToFetch = Array.from(recentChatsMap.values()).map(
    (c) => c.otherUserId
  );
  if (userIdsToFetch.length === 0) return [];

  const { data: profiles, error: cerror } = await supabase
    .from("profiles") // Assuming you have a 'profiles' table with 'id' and 'name'
    .select("id, name")
    .in("id", userIdsToFetch);
  if (cerror) {
    console.log(cerror);
  }
  console.log(userIdsToFetch);

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  // 4. Combine chat data with profile names
  const finalChats = Array.from(recentChatsMap.values()).map((chat) => ({
    ...chat,
    name: profileMap.get(chat.otherUserId)?.name || "Unknown User",
    role: profileMap.get(chat.otherUserId)?.role || "User",
  }));

  return finalChats;
}
