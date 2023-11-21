import React from "react";
import { Modal, Input } from "antd";

import Image from "next/image";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function Editmap({
  latLng,
  setLatLng,
  mapModalOpen,
  handleCloseMapModal,
  editedRow,
  setEditedRow,
  mode,
  setMode
}) {
  const UpdateMapPosition = () => {
    const map = useMapEvents({
      click(e) {
        setLatLng(e.latlng);
        setEditedRow({
          ...editedRow,
          location: [e.latlng.lat, e.latlng.lng],
        });
      },
    });
    return null;
  };
  return (
    
      <Modal
        title="Change Coordinates"
        centered
        visible={mapModalOpen}
        onOk={handleCloseMapModal}
        onCancel={handleCloseMapModal}
        className="w-1/2"
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
            className="mb-5"
          >
            <div style={{ flex: 1, marginRight: "10px" }}>
              <label htmlFor="latitude" className="mb-2 text-[#333] font-light">
                Latitude:
              </label>
              <Input
                type="number"
                id="latitude"
                name="latitude"
                value={editedRow.location[0]}
                onChange={(e) => {
                  const newLat = e.target.value
                    ? parseFloat(e.target.value)
                    : null;
                  setLatLng([newLat, latLng[1]]);
                  setEditedRow({
                    ...editedRow,
                    location: [newLat, latLng[1]],
                  });
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="longitude"
                className="text-[#333] font-light mb-2"
              >
                Longitude:
              </label>
              <Input
                type="number"
                id="longitude"
                name="longitude"
                value={editedRow.location[1]}
                onChange={(e) => {
                  const newLng = e.target.value
                    ? parseFloat(e.target.value)
                    : null;
                  setLatLng([latLng[0], newLng]);
                  setEditedRow({
                    ...editedRow,
                    location: [latLng[0], newLng],
                  });
                }}
              />
            </div>
          </div>
          <MapContainer
            center={latLng}
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
            <Marker
              draggable={true}
              position={
                latLng[0] !== null && latLng[1] !== null
                  ? latLng
                  : [12.99097225692328, 80.17281532287599]
              }
            ></Marker>

            <UpdateMapPosition setLatLng={setLatLng} />
          </MapContainer>
        </div>
      </Modal>
   
  );
}

export default Editmap;
