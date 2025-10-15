import { getServerSupabaseClient } from "./supabase";
export async function getVolunteer(email) {
  const supabase = await getServerSupabaseClient();

  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("email", email);

  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}
export async function getProvider(email) {
  const supabase = await getServerSupabaseClient();

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("email", email);
  if (error) {
    console.log(error);
    return { error };
  }
  return data;
}
