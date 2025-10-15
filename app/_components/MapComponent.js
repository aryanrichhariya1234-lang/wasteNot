"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });
function MapComponent({ orderList, position, setPosition, setCityName }) {
  return (
    <Map
      orderList={orderList}
      position={position}
      setPosition={setPosition}
      setCityName={setCityName}
    />
  );
}

export default MapComponent;
