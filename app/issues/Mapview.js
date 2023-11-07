"use client"
import { React, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
//import "leaflet-defaulticon-compatibility";
//import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation"; 
import useSWR from "swr";
import Image from "next/image";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MapView = () => {
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issues",
    fetcher,
    { refreshInterval: 10000 }
  );

  const [locations, setLocations] = useState([]);
  const [mode, setMode] = useState(false);
  useEffect(() => {
    if (data) {
      const extractedLocations = data
        .map((issue) => issue.location)
        .filter((location) => location && location.length === 2);
  
      console.log(extractedLocations);
      setLocations(extractedLocations);
    }
  }, [data]);

  if (isLoading) return <p>loading</p>

  return (
    <div className="w-full h-[600px]">
      {typeof window !== "undefined" && (
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
              {locations.map((location, index) => (
            <Marker
              key={index}
              position={[
                parseFloat(location[0]),
                parseFloat(location[1]),
              ]}
              eventHandlers={{
                click: () => {
                  // router.push(`/issues/${locData.asset_id}`);
                },
              }}
            >
              <Popup>Location:</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;
