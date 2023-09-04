import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = () => {
  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={[12.99097225692328, 80.17281532287599]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <Marker position={[12.99097225692328, 80.17281532287599]}>
          <Popup>A sample marker!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
