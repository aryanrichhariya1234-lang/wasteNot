// app/_components/ActivePickupsBar.js
"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { handleConfirmPickup } from "../_lib/actions";

// import { confirmFinalPickup } from '../_lib/actions'; // Placeholder Server Action

// Mock Server Action
export const revalidate = 0;

export default function ActivePickupsBar({ orderList, currentUserId }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // For portal safety
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!orderList || !currentUserId) return null;

  // Filter for orders assigned to the current user AND marked as 'in progress'
  const activePickups = orderList.filter(
    (order) =>
      order.volunteerId === currentUserId &&
      !order.isDelivered &&
      order.isBeingPickup
  );

  if (activePickups.length === 0) {
    return null;
  }

  // Use the most urgent order for the main reminder
  const nextPickup = activePickups.sort(
    (a, b) => new Date(a.pickupTime) - new Date(b.pickupTime)
  )[0];

  // Modal Content Component (defined inline for simplicity)
  const ConfirmationModal = () => (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-opacity-70">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Confirm Final Pickup
        </h3>
        <p className="text-gray-700 mb-6">
          Did you successfully pick up **Order #{nextPickup.id}** from{" "}
          {nextPickup?.foodProvider}? This confirms the order status.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsConfirmModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Not Yet
          </button>
          <button
            onClick={() => {
              setIsConfirmModalOpen(false);
              handleConfirmPickup(nextPickup, pathname);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Yes, Confirmed!
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Portal for the Confirmation Modal */}
      {mounted &&
        isConfirmModalOpen &&
        createPortal(<ConfirmationModal key={nextPickup.id} />, document.body)}

      {/* Fixed bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-yellow-100 shadow-2xl border-t-4 border-yellow-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-900 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-bold text-yellow-900">
                {activePickups.length} Active Pickup
                {activePickups.length > 1 ? "s" : ""} in Progress!
              </p>
              <p className="text-xs text-yellow-800">
                Next up: **Order #{nextPickup.id}** from{" "}
                {nextPickup?.foodProvider}
              </p>
            </div>
          </div>

          {/* CONFIRM PICKUP BUTTON */}
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Confirm Pickup
          </button>
        </div>
      </div>
    </>
  );
}
