"use client";

import React, { useState } from "react";

import OrderList from "./OrderList";
import NewOrderModal from "./NewOrderModal";

function FoodList({
  profileId,
  userId,
  setCityName,
  orderList: List,
  volunteer,
  handleClick,
  cityName,
  position,
  provider,
  handlePickup,
  id,
  setId,
  setIsOpen,
  isOpen,
  order,
  setOrder,
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <div className="flex-none w-[40%] bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
        <div className="grid grid-cols-2">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              All Food Listings
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Click an order to view details.
            </p>
          </div>
          {!volunteer ? (
            <div className="ml-52">
              <button
                onClick={() => setIsOpenModal(true)}
                className="flex  px-2 py-4 w-30 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition disabled:bg-green-400  "
              >
                Add new Order
              </button>
            </div>
          ) : null}
        </div>

        {!volunteer ? (
          isOpenModal ? (
            <NewOrderModal
              userId={userId}
              position={position}
              handleClick={handleClick}
              onClose={() => setIsOpenModal(false)}
              cityName={cityName}
              provider={provider}
              volunteer={volunteer}
              setCityName={setCityName}
              setIsOpenModal={setIsOpenModal}
            />
          ) : (
            <OrderList
              List={List}
              userId={userId}
              handlePickup={handlePickup}
            />
          )
        ) : (
          <OrderList
            userId={userId}
            List={List}
            volunteer={volunteer}
            handlePickup={handlePickup}
            id={id}
            setId={setId}
            isOpen={isOpen}
            profileId={profileId}
            setIsOpen={setIsOpen}
            order={order}
            setOrder={setOrder}
          />
        )}
      </div>
    </>
  );
}

export default FoodList;
