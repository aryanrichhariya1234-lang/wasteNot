"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { usePathname, useRouter } from "next/navigation";
import { getAddress } from "../_utils/utils";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

function Map({ orderList, position, setPosition, setCityName }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Convert order positions into usable markers
  const markers = orderList.map((order) => {
    const [latPart, lngPart] = order.position.split(",");
    return {
      lat: Number(latPart.split(":")[1]),
      lng: Number(lngPart.split(":")[1]),
    };
  });
  useEffect(() => {
    import("@/leadlet.config");
  }, []);

  useEffect(() => {
    if (!position) return;

    async function updatePosition() {
      router.replace(`${pathname}?lat=${position.lat}&lng=${position.lng}`);
      const address = await getAddress(position);

      setCityName(address.city);
    }
    updatePosition();
  }, [pathname, position, router, setCityName]);

  useEffect(() => setIsClient(true), []);
  if (!isClient) return <p>Loading map...</p>;

  return (
    <MapContainer
      key={`${position?.lat}-${position?.lng}`}
      center={position || markers[0]}
      zoom={13}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((pos, i) => (
        <Marker position={pos} key={i}>
          <Popup>Order location</Popup>
        </Marker>
      ))}
      <Centering position={position || markers[0]} />
      <SetPosition setPosition={setPosition} />
    </MapContainer>
  );
}

function Centering({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [map, position]);
  return null;
}

function SetPosition({ setPosition }) {
  useMapEvents({
    click: (e) => {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default Map;
