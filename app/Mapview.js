import { React, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from 'next/navigation';
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MapView = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 10000 }
  );

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (data) {
      const extractedLocations = data
        .filter(asset => asset.type_fields && asset.type_fields.Location )
        .map(asset => asset.type_fields.Location)
        .filter(loc => loc && loc.lat && loc.lng);   
      console.log(extractedLocations);    
      setLocations(extractedLocations);
    }
  }, [data]);

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={[12.99097225692328, 80.17281532287599]}
        zoom={13}
        className="w-full h-full">
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lng]}>
            <Popup>Location: {loc.lat}, {loc.lng}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
