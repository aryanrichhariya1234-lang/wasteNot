import { redirect } from "next/navigation";

export default function ProfileHome() {
  redirect("/profile/reservations");
}
