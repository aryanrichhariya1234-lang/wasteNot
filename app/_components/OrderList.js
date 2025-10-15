import { createPortal } from "react-dom";
import { formatDateTime } from "../_utils/utils";
import EditOrderModal from "./EditOrder";
import VolunteerOrderModal from "./VolunteerOrderWindow";

function OrderList({
  userId,
  List: orderList,
  volunteer,
  handlePickup,
  id,
  setIsOpen,
  isOpen,
  setId,
  order,
  setOrder,
}) {
  const sortedOrders = [...orderList].sort((a, b) => {
    const timeA = new Date(a.pickupTime).getTime();
    const timeB = new Date(b.pickupTime).getTime();
    return timeB - timeA;
  });

  return (
    <>
      {isOpen &&
        !volunteer &&
        createPortal(
          <EditOrderModal
            isOpen={isOpen}
            id={id}
            onClose={() => setIsOpen(false)}
          />,
          document.body
        )}
      {isOpen && volunteer && order && (
        <VolunteerOrderModal
          id={id}
          userId={userId}
          order={order}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {sortedOrders.length === 0 ? (
        <div
          key={""}
          className="text-center p-8 text-gray-500 border border-dashed border-gray-300 rounded-md mt-4"
        >
          <p className="font-semibold">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4 pr-2">
          {sortedOrders.map((order) => {
            const isPending = order.isBeingPickup;
            const isAvaliable = !order.isDelivered && !order.isBeingPickup;
            const cardStyle = isAvaliable
              ? "bg-green-50 border-green-300 hover:shadow-lg "
              : "bg-gray-100 border-gray-300 hover:shadow-md";

            return (
              <div
                onClick={() => handlePickup(order.id)}
                key={order.id}
                className={`border rounded-lg p-4 shadow-sm transition duration-200 cursor-pointer ${cardStyle}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="font-extrabold text-green-700 mr-2">
                      #{order.id}
                    </span>
                    {order.foodProvider}
                  </h3>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      isAvaliable
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isAvaliable ? "Avalaible to pick up" : "Not Avalaible"}{" "}
                    {isPending && "Being picked up"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {order.items}
                </p>
                <div className="flex justify-between items-center mt-3 text-sm">
                  {!volunteer ? (
                    <span className="text-gray-500">
                      Pickup:{" "}
                      <span className="font-medium text-gray-800">
                        {formatDateTime(order.pickupTime)}
                      </span>
                    </span>
                  ) : null}

                  {!volunteer ? (
                    isPending ? (
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition duration-150">
                        Edit/Cancel »
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">
                        By V-ID: {order.volunteerId}
                      </span>
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
      ;
    </>
  );
}

export default OrderList;
