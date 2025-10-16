"use client";
import { useRouter } from "next/navigation";
import FoodList from "./FoodList";
import MapComponent from "./MapComponent";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getAddress, getPosition } from "../_utils/utils";
import { getOrderOnClient } from "../_lib/clientSideFunctions";
import ActivePickupsBar from "./ActivePickUpsBar";

function AppComponent({ orderList, provider, volunteer, userId, profileId }) {
  const [position, setPosition] = useState(null);
  const [cityName, setCityName] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [id, setId] = useState(null);
  const [order, setOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  async function handlePickup(id) {
    setId(id);
    const res = await getOrderOnClient(id);
    const orderDetails = res[0];
    setOrder(orderDetails);

    setPosition({
      lat: Number(orderDetails.position.split(",")[0].split(": ")[1]),
      lng: Number(orderDetails.position.split(",")[1].split(": ")[1]),
    });

    // NOTE: Reminder creation logic should go here if you decide to keep it.

    setIsOpen(true);
  }

  async function getCurrentPosition() {
    const currentPosition = await getPosition();

    setPosition({
      lat: currentPosition.coords.latitude,
      lng: currentPosition.coords.longitude,
    });
    const address = await getAddress(position);
    setCityName(address.city);

    router.replace(
      `${pathname}?lat=${currentPosition.coords.latitude}&lng=${currentPosition.coords.longitude}`
    );
  }

  // Determine if the bar should be active to adjust layout padding
  const hasActivePickups = orderList.some(
    (order) =>
      order.volunteerId === userId &&
      !order.isDelivered &&
      order.isBeingPickedUp
  );

  return (
    // Add bottom padding conditionally to make space for the fixed bar
    <div
      className={`flex flex-col flex-grow h-full ${
        hasActivePickups ? "pb-20" : ""
      }`}
    >
      {/* Main Content Area */}
      <div className="flex flex-grow h-full p-8 space-x-6">
        <FoodList
          userId={userId}
          position={position}
          orderList={orderList}
          handleClick={getCurrentPosition}
          setCityName={setCityName}
          cityName={cityName}
          provider={provider}
          volunteer={volunteer}
          profileId={profileId}
          handlePickup={handlePickup}
          id={id}
          setId={setId}
          order={order}
          setOrder={setOrder}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div className="z-0 flex-grow w-[60%] bg-white rounded-lg p-6 overflow-y-auto h-auto">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
            <MapComponent
              orderList={orderList}
              position={position}
              volunteer={volunteer}
              setPosition={setPosition}
              setCityName={setCityName}
            />
          </div>
        </div>
      </div>

      <ActivePickupsBar orderList={orderList} currentUserId={userId} />
    </div>
  );
}

export default AppComponent;
