import React, { memo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconMedium from "../../assets/iconMedium.png";
import iconHigh from "../../assets/iconHigh.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import SideCard from "../sideCard/SideCard";
import satellite from "../../assets/satellite.jpg";
import normal from "../../assets/normal.jpg";

const lowIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [20, 40],
});

const highIcon = new Icon({
  iconUrl: iconHigh,
  shadowUrl: iconShadow,
  iconAnchor: [20, 40],
});

const mediumIcon = new Icon({
  iconUrl: iconMedium,
  shadowUrl: iconShadow,
  iconAnchor: [20, 40],
});

const MapView = ({
  clickEnabled = false,
  issues,
  width = "calc(100vw - 90px)",
  height = "calc(100vh - 280px)",
  isDraggable = false,
  setLocation,
  setIssues,
  small,
  filterDiv,
  timeZone,
}) => {
  const [filter, setFilter] = useState("All");
  const handleIssues = (status) => {
    setFilter(status);
  };
  const findCount = (filter) => {
    return issues.filter((issue) => issue.status === filter).length;
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [mode, setMode] = useState(true);

  const handleMarkerDragEnd = (e, index) => {
    const newLocation = [
      e.target.getLatLng().lat.toString(),
      e.target.getLatLng().lng.toString(),
    ];
    setLocation(newLocation);

    console.log(newLocation);
    setSelectedRow(-1);
    setShowPopup(false);
  };

  const [priorityFilter, setPriorityFilter] = useState("all");

  return (
    <div className="w-full h-full">
      {filterDiv && (
        <div className="flex flex-row justify-between content-center overflow-x-auto hide-scrollbar">
          <div className="">
            <h1 className="text-sm content-center pt-3 min-w-[100px]">
              <strong>
                Issues ({filter === "All" ? issues.length : findCount(filter)})
              </strong>
            </h1>
          </div>
          <div className="flex flex-none">
            <button
              onClick={() => handleIssues("All")}
              className={
                filter === "All"
                  ? "bg-[#203864] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#203864] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
                  : "bg-[#262626] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#262626] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
              }
            >
              Show all
            </button>
            <button
              onClick={() => handleIssues("open")}
              className={
                filter === "open"
                  ? "bg-[#203864] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#203864] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
                  : "bg-[#262626] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#262626] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
              }
            >
              Open issues
            </button>
            <button
              onClick={() => handleIssues("inProgress")}
              className={
                filter === "inProgress"
                  ? "bg-[#203864] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#203864] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
                  : "bg-[#262626] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#262626] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
              }
            >
              In-progress issues
            </button>
            <button
              onClick={() => handleIssues("closed")}
              className={
                filter === "closed"
                  ? "bg-[#203864] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#203864] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
                  : "bg-[#262626] text-sm hover:bg-[#203864] mb-4 mx-2 my-2 border-b-4 border-[#262626] hover:border-[#203864] font-semibold  py-1 px-6  border rounded-full"
              }
            >
              Closed issues
            </button>
          </div>
          <div className="flex flex-row justify-center">
            <div className="flex flex-row bg-gray-900 rounded-xl justify-center mb-4 items-center p-1">
              <select
                className="w-40 p-[3px] bg-[#3E3E3E] rounded"
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <MapContainer
        className="z-[0]"
        style={{
          width: width,
          height: height,
        }}
        center={issues[0].location}
        zoom={15}
      >
        {mode ? (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}
        <img
          src={mode ? normal : satellite}
          style={{
            position: "absolute",
            bottom: 5,
            left: 5,
            width: small ? "50px" : "100px",
            height: small ? "50px" : "100px",
            zIndex: 9999,
            borderRadius: 5,
          }}
          onClick={() => setMode(!mode)}
        />
        {issues
          .filter((issue) => filter === "All" || issue.status === filter)
          .filter(
            (issue) =>
              priorityFilter === "all" || issue.priority === priorityFilter
          )
          .map((issue, index) => (
            <Marker
              key={index}
              position={issue.location}
              icon={
                issue.priority === "high"
                  ? highIcon
                  : issue.priority === "medium"
                  ? mediumIcon
                  : lowIcon
              }
              draggable={isDraggable}
              eventHandlers={{
                dragend: (e) => handleMarkerDragEnd(e, index),
              }}
            >
              <Popup>
                <button
                  className="hover:text-cyan-600"
                  onClick={() => {
                    if (clickEnabled) {
                      setSelectedRow(index);
                      setShowPopup(true);
                    }
                  }}
                >
                  <div>{issue.remarks}</div>
                  <div>
                    {new Date(issue.reported_time).toLocaleString("en-BZ", {
                      timeZone,
                    })}
                  </div>
                </button>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      {showPopup && (
        <SideCard
          className="z-[50]"
          togglePopUp={setShowPopup}
          issue={issues[selectedRow]}
          setIssues={setIssues}
          timeZone={timeZone}
        />
      )}
    </div>
  );
};
export default MapView;
