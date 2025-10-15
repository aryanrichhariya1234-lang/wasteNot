import { formatDateTime } from "../_utils/utils";

export default function OrderDetail({ order }) {
  const {
    id,
    foodProviderName,
    items,
    weight,
    pickupTime,
    isDelivered,
    volunteerId,
    position,
  } = order;
  const isPending = !isDelivered;

  return (
    <div className="bg-white p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button className="text-gray-600 hover:text-gray-800 transition duration-150 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
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
          Back to Listings
        </button>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ${
            isPending
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isPending ? "Pending Pickup" : "Delivered"}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold text-green-700 mb-2">
        Order #{id}
      </h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Provider: {foodProviderName}
      </h2>

      <div className="space-y-4 text-gray-700">
        <p>
          <span className="font-semibold">Items:</span> {items}
        </p>
        <p>
          <span className="font-semibold">Weight:</span> {weight} kg
        </p>
        <p>
          <span className="font-semibold">Scheduled Pickup:</span>{" "}
          {formatDateTime(pickupTime)}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {position}
        </p>

        {isDelivered && (
          <p className="border-t pt-4">
            <span className="font-semibold">Delivered By Volunteer ID:</span>{" "}
            {volunteerId}
          </p>
        )}

        {isPending && (
          <div className="pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-200">
              Edit Pickup Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
