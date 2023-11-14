"use client";
import { React, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MapView = () => {
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 10000 }
  );

  const [locations, setLocations] = useState([]);
  const [mode, setMode] = useState(false);

  useEffect(() => {
    if (data) {
      const extractedLocations = data
        .filter((asset) => asset.type_fields && asset.type_fields.Location)
        .map((asset) => ({
          location: asset.type_fields.Location,
          asset_id: asset.asset_id,
        }))
        .filter(
          (locData) =>
            locData.location && locData.location.lat && locData.location.lng
        );
      console.log(extractedLocations);
      setLocations(extractedLocations);
    }
  }, [data]);

  if(isLoading) return <>Loading</>

  return (
    <div className="w-full h-[600px]">
      <MapContainer
        center={[12.99097225692328, 80.17281532287599]}
        zoom={13}
        className="w-full h-[600px]"
      >
        {mode ? (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}

        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000, // to make sure it's above the map layers
          }}
          onClick={() => setMode(!mode)}
        >
          {mode ? (
            <Image
              src="/normal.png"
              className="border"
              width={100}
              height={100}
              alt="Satellite View"
            />
          ) : (
            <Image
              src="/satellite.png"
              className="border"
              width={100}
              height={100}
              alt="Normal View"
            />
          )}
        </div>

        {locations.map((locData, index) => (
          <Marker
            key={index}
            position={[locData.location.lat, locData.location.lng]}
            eventHandlers={{
              click: () => {
                router.push(`/assets/${locData.asset_id}`);
              },
            }}
          >
            <Popup>
              Location: {locData.location.lat}, {locData.location.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
