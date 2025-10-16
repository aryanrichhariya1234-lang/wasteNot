"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link"; // Import Link for navigation
import {
  getProfileOnClient,
  getProviderOnClient,
  getUserOnClient,
} from "../_lib/clientSideFunctions";

// Utility to format time (reuse)
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function VolunteerOrderModal({
  profileId,
  userId,
  id,
  isOpen,
  onClose,
  order,
}) {
  const isPickupInProgress = order?.isBeingPickup;
  const isDelivered = order?.isDelivered;
  const router = useRouter(); // Initialize router
  const [providerId, setProviderId] = useState(null);
  const [email, setEmail] = useState("");
  const [uuid, setUuid] = useState(null);
  useEffect(
    function () {
      async function get() {
        const data = await getProviderOnClient(id);
        setProviderId(data[0]?.providerId);

        const data2 = await getUserOnClient(providerId);
        setEmail(data2[0]?.email);

        const data3 = await getProfileOnClient(email);
        setUuid(data3[0]?.id);
      }
      get();
    },
    [id, email, providerId]
  );
  // Assuming handleAction is defined in your Server Actions file
  async function handleAction(id, pathname, onClose, userId) {
    // --- Existing Server Action Logic ---
    // This is where you would call your Server Action to update the order status
    // const data = await pickupOrder(id, pathname, userId);
    // if (data.error) { toast.error('Pickup confirmation failed.'); } else { toast.success('Pickup confirmed!'); }

    // TEMPORARY MOCK
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Pickup action triggered (Mocked)");
    onClose();
    // router.refresh(); // Uncomment this in your final app
  }

  // Handle opening the chat window with the provider
  const handleChat = () => {
    // The provider's ID is stored in order.providerId
    const providerId = order?.providerId;
    if (providerId) {
      // Close the modal first, then navigate to the messages page with the chat param
      onClose();
      router.push(`/profile/messages?chat=${uuid}`);
    } else {
      toast.error("Provider ID not available to start chat.");
    }
  };

  if (!isOpen || !order) return null;

  return (
    <form action={() => handleAction(id, pathname, onClose, userId)}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center  bg-opacity-70">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isPickupInProgress
                ? "Pickup IN PROGRESS"
                : "Confirm Pickup: Order #"}
              {order.orderId}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Status Message (Unchanged) */}
          <div
            className={`p-4 mb-6 rounded-lg font-semibold text-center ${
              isDelivered
                ? "bg-green-100 text-green-700"
                : isPickupInProgress
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isDelivered
              ? "This order has been SUCCESSFULLY DELIVERED."
              : isPickupInProgress
              ? "This pickup is currently IN PROGRESS."
              : "This order is READY FOR PICKUP."}
          </div>

          {/* Order Details */}
          <div className="space-y-4 text-gray-700 mb-6">
            <p>
              <span className="font-semibold">Provider:</span>
              {order.foodProviderName || order.foodProvider}
            </p>
            <p>
              <span className="font-semibold">Items:</span> {order.items}
            </p>
            <p>
              <span className="font-semibold">Weight:</span> {order.weight} kg
            </p>
            <p>
              <span className="font-semibold">Scheduled:</span>
              {formatDateTime(order.pickupTime)}
            </p>
          </div>

          {/* --- NEW CHAT BUTTON --- */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={handleChat}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              disabled={isDelivered}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.593 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Send Hi to Enquire More (Chat)</span>
            </button>
          </div>

          {/* Action Buttons (Unchanged) */}
          <div className="flex justify-between space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDelivered}
              className={`flex-1 px-4 py-3 font-semibold rounded-md shadow-sm transition ${
                isDelivered
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              Cancel Pickup
            </button>
            <button
              type="submit" // Submits the form, triggering the Server Action
              disabled={isPickupInProgress || isDelivered}
              className={`flex-1 px-4 py-3 text-white font-semibold rounded-md shadow-md transition ${
                isDelivered
                  ? "bg-green-700 cursor-not-allowed"
                  : isPickupInProgress
                  ? "bg-blue-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isDelivered
                ? "DELIVERED"
                : isPickupInProgress
                ? "IN PROGRESS"
                : "Confirm Pickup Now"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
