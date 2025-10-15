import { supabaseClient } from "./supabaseClient";

export async function getOrderOnClient(id) {
  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("id", id);
  if (error) {
    console.log(error);
    return { error };
  }
  return orders;
}

export async function getCurrentUserOrders(id) {
  const { data, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("volunteerId", id);
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}
