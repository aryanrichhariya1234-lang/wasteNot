"use client";

import React from "react";

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

export default function OrderCardList({ orders, isUpcoming }) {
  if (!orders || orders.length === 0) {
    return (
      <p className="text-gray-500 mt-4 italic">
        {isUpcoming
          ? "No current pickups scheduled."
          : "No completed deliveries yet."}
      </p>
    );
  }

  // Determine card styling based on category
  const cardColor = isUpcoming
    ? "bg-blue-100 border-blue-300"
    : "bg-green-100 border-green-300";
  const textColor = isUpcoming ? "text-blue-800" : "text-green-800";

  return (
    <div className="space-y-3 mt-4 max-h-96 overflow-y-auto pr-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`p-3 border rounded-lg shadow-sm ${cardColor}`}
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">Order #{order.id}</p>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${textColor}`}
            >
              {isUpcoming
                ? order.isBeingPickedUp
                  ? "In Progress"
                  : "Confirmed"
                : "Completed"}
            </span>
          </div>
          <p className="text-xs text-gray-700 mt-1 line-clamp-1">
            From: {order.foodProvider}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isUpcoming ? "Scheduled: " : "Delivered: "}
            {formatDateTime(order.pickupTime)}
          </p>
        </div>
      ))}
    </div>
  );
}
