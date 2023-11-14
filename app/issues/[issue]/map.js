import { React, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import Image from "next/image";

function Map({ latLng, setLatLng }) {
  const [mode, setMode] = useState(false);

  const UpdateMapPosition = () => {
    const map = useMapEvents({
      click(e) {
        setLatLng([parseFloat(e.latlng.lat),parseFloat( e.latlng.lng)]);
      },
    });
    return null;
  };

  return (
    <div key="map">
      <MapContainer
        center={[12.99097225692328, 80.17281532287599]}
        zoom={13}
        style={{ width: "100%", height: "300px" }}
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
            <Image src="/normal.png" className="border" width={100} height={100} alt="Satellite View" />
          ) : (
            <Image src="/satellite.png" className="border" width={100} height={100} alt="Normal View" />
          )}
        </div>
        <Marker
          position={[
            latLng.length >= 1 ? latLng[0] : 12.99097225692328,
            latLng.length == 2 ? latLng[1] : 80.17281532287599,
          ]}
        ></Marker>
        <UpdateMapPosition setLatLng={setLatLng} />
      </MapContainer>
    </div>
  );
}

export default Map;
