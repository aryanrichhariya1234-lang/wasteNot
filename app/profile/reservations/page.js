// app/profile/reservations/page.js
import { headers } from "next/headers";
import { Suspense } from "react";
import OrderCardList from "@/app/_components/OrderCardList";
import Spinner from "@/app/_components/Spinner"; // Assuming you have a spinner
import { getServerSupabaseClient } from "@/app/_lib/supabase";
import { getUser } from "@/app/_lib/actions";
import {
  getOrders,
  getProviderOrders,
  getVolunteerOrders,
} from "@/app/_lib/data-service";

// Set to 0 to ensure the list is always up-to-date
export const revalidate = 0;

export default async function ReservationsPage() {
  const supabase = await getServerSupabaseClient();
  const user = await supabase.auth.getUser();
  const currentUser = await getUser(user.data.user.email);
  let result;
  if (currentUser.fullName) {
    result = await getVolunteerOrders(currentUser.id);
  } else {
    result = await getProviderOrders(currentUser.id);
  }
  const orders = result?.error ? [] : result;

  // 1. Filter the orders into two categories
  const completedOrders = orders.filter((order) => order.isDelivered);

  // Upcoming are those that are NOT delivered
  const upcomingOrders = orders.filter((order) => !order.isDelivered);

  if (result?.error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded-lg">
        Error fetching data: {result.error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Reservations & Pickup History
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Upcoming Pickups Column */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md">
          <h3 className="font-semibold text-xl text-blue-700">
            Upcoming Pickups ({upcomingOrders.length})
          </h3>
          <p className="text-sm text-gray-700 mt-2">
            Orders currently assigned to you and pending action.
          </p>

          <Suspense
            fallback={
              <div className="h-40 flex items-center justify-center">
                <Spinner size="md" color="text-blue-500" />
              </div>
            }
          >
            <OrderCardList orders={upcomingOrders} isUpcoming={true} />
          </Suspense>
        </div>

        {/* Completed Deliveries Column */}
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-md">
          <h3 className="font-semibold text-xl text-green-700">
            Completed Deliveries ({completedOrders.length})
          </h3>
          <p className="text-sm text-gray-700 mt-2">
            Summary of all food rescue missions you have successfully completed.
          </p>

          <Suspense
            fallback={
              <div className="h-40 flex items-center justify-center">
                <Spinner size="md" color="text-green-500" />
              </div>
            }
          >
            <OrderCardList orders={completedOrders} isUpcoming={false} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
