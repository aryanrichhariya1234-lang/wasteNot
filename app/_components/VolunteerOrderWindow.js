"use client";

import React from "react";
// Assuming pickupOrder is your Server Action to mark the order as 'in progress'
import { handleAction, pickupOrder } from "../_lib/actions";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

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
  userId,
  id,
  isOpen,
  onClose,
  order, // Contains all order details, including isBeingPickedUp
  // handlePickup is no longer strictly needed here, as the form handles the Server Action
}) {
  // 1. Determine the status based on the order prop
  const isPickupInProgress = order?.isBeingPickup;
  const isDelivered = order?.isDelivered; // Assuming you have a final 'isDelivered' status
  const pathname = usePathname();

  if (!isOpen || !order) return null;

  return (
    // Form action is now wrapped in a function to pass the ID
    <form
      action={() => {
        handleAction(id, pathname, onClose, userId);
        onClose();
      }}
    >
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-70">
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
              type="button" // Important for buttons not in a form submit flow
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

          {/* Status Message */}
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

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4 pt-6">
            {/* Cancel Button - Available unless Delivered */}
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              disabled={isDelivered}
              className={`flex-1 px-4 py-3 font-semibold rounded-md shadow-sm transition ${
                isDelivered
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              Cancel Pickup
            </button>

            {/* Pickup/Status Button */}
            <button
              type="submit" // Submits the form, triggering the Server Action
              disabled={isPickupInProgress || isDelivered} // Disable if already in progress or delivered
              className={`flex-1 px-4 py-3 text-white font-semibold rounded-md shadow-md transition ${
                isDelivered
                  ? "bg-green-700 cursor-not-allowed" // Delivered
                  : isPickupInProgress
                  ? "bg-blue-500 cursor-not-allowed" // In Progress
                  : "bg-green-600 hover:bg-green-700" // Available
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
