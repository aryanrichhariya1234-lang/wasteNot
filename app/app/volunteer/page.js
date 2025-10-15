import Link from "next/link";

import { getOrders } from "@/app/_lib/data-service";
import AppComponent from "@/app/_components/AppComponent";
import { getServerSupabaseClient } from "@/app/_lib/supabase";
import { getProvider, getVolunteer } from "@/app/_lib/providers";
import { unstable_noStore } from "next/cache";

export const revalidate = 0;
export default async function page() {
  let volunteer;
  let userId;
  unstable_noStore();
  const orderList = await getOrders();
  const supabase = await getServerSupabaseClient();
  const user = await supabase.auth.getUser();
  const provider = await getProvider(user.data.user.email);
  if (provider) {
    userId = provider[0]?.id;
    volunteer = false;
  }
  volunteer = true;
  const volunteerId = await getVolunteer(user.data.user.email);
  userId = volunteerId[0].id;

  return (
    <>
      <div className="relative h-screen bg-gray-100 pb-5">
        <Link
          href="/"
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white shadow-lg transition-transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>

        <Link
          href={`/profile`}
          className="absolute z-50 top-4 right-4  py-2 px-4 rounded-full bg-white text-gray-800 font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Profile
        </Link>

        <AppComponent
          userId={userId}
          volunteer={volunteer}
          orderList={orderList}
          provider={provider}
        />
      </div>
    </>
  );
}
