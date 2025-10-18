"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNewOrder,
  createProvider,
  createVolunteer,
  editOrder,
  loginUser,
  signOut,
  signUp,
} from "./data-service";
import { getProvider, getVolunteer } from "./providers";
import { getServerSupabaseClient } from "./supabase";
function getFormattedDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const now = getFormattedDateTime();

export async function createProviderAccount(formData) {
  const businessName = formData.get("businessName");
  const contactPerson = formData.get("contactPerson");
  const email = formData.get("email");
  const password = formData.get("password");
  const businessAddress = formData.get("businessAddress");
  const foodDescription = formData.get("foodDescription");
  const terms = formData.get("terms") === "on" ? true : false;

  if (!email || !password || !terms) return null;
  const data = await signUp(email, password, contactPerson);
  if (data.error) return null;

  const createData = await createProvider({
    businessName,
    businessAddress,
    email,
    foodDescription,
    contactPerson,
  });
  if (createData.error) return null;

  redirect("/");
}

export async function createVolunteerAccount(formData) {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");
  const location = formData.get("location");
  const terms = formData.get("terms") === "on" ? true : false;
  if (!email || !password || !terms) return null;
  const data = await signUp(email, password, fullName);
  if (data.error) {
    console.log(data.error);
    return null;
  }
  const volunteerData = await createVolunteer({ fullName, email, location });
  if (volunteerData.error) return null;
  redirect("/");
}

export async function loginUserWithEmail(formData) {
  const role = formData.get("role");
  const email = formData.get("email");
  const password = formData.get("password");
  await loginUser(role, email, password);

  redirect("/");
}
export async function signOutWithEmail() {
  await signOut();
}

export async function getUser(email) {
  let user;
  user = await getVolunteer(email);

  if (!user[0]?.fullName) {
    user = await getProvider(email);
  }

  return user[0];
}

export async function editCurrentForn({ id, formData }) {
  const items = formData.get("items");
  const weight = formData.get("weight");
  const updatedOrder = { items, weight };
  const data = editOrder({ id, updatedOrder });
  if (data.error) {
    console.log(error);
    return error;
  }
  return data;
}

export async function createOrder({ formData, position, provider }) {
  const items = formData.get("items");
  const weight = formData.get("weight");
  const foodProvider = formData.get("foodProvider");
  const isDelivered = false;
  const newPosition = `lat: ${position.lat}, lng: ${position.lng}`;
  const order = {
    items,
    weight,
    isDelivered,
    position: newPosition,
    providerId: provider[0].id,
    pickupTime: now,
    isBeingPickup: false,
    foodProvider,
  };
  const data = await createNewOrder(order);
  if (data.error) {
    return null;
  }
  revalidatePath("app/provider");
  return data;
}

export async function pickupOrder(id, userId) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ isBeingPickup: true, volunteerId: userId })
    .eq("id", id);
  if (error) {
    console.log(error);
    return { error };
  }

  return data;
}

export async function handleAction(id, pathname, onClose, userId) {
  // You should add client-side error handling/toasts here
  const result = await pickupOrder(id, userId);

  if (result?.error) {
    console.log(result?.error);
    return result?.error;
  } else {
    // Successful pickup confirmation logic (e.g., refresh list, close modal)

    revalidatePath(`${pathname}`);
  }
}

export async function confirmFinalPickup(id) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ isDelivered: true })
    .eq("id", id);
  if (error) {
    console.log(error);
    return { error };
  }

  return data;
}

export async function handleConfirmPickup(nextPickup, pathname) {
  // In a real app, you would dispatch a Server Action here:
  // This action should set isDelivered = true and remove isBeingPickup = false
  const result = await confirmFinalPickup(nextPickup.id);

  if (result?.error) {
    console.log(result?.error);
    return result?.error;
  } else {
    // Successful pickup confirmation logic (e.g., refresh list, close modal)

    revalidatePath(`${pathname}`);
  }
}
