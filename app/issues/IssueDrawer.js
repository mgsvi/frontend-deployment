"use client";
import { React, useState, useEffect } from "react";
import {
  Drawer,
  Divider,
  Carousel,
  Button,
  Modal,
  Image,
  message,
  Space,
  Select,
  Form,
  Input,
} from "antd";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import Chat from "./Chat";
import { MdLocationPin } from "react-icons/md";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { PiFolderOpenFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
  selectedRow.status === key;
};

const temp = [
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
];

const IssueDrawer = ({ open, onClose, selectedRow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(selectedRow);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [mapModalOpen, setmapModalOpen] = useState(false);

  const [latLng, setLatLng] = useState([
    editedRow.location[0],
    editedRow.location[1],
  ]);

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
  console.log(editedRow.location);
  const [mode, setMode] = useState(true);

  const handleOpenMapModal = () => {
    setmapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setmapModalOpen(false);
    setEditedRow({ ...editedRow, location: [latLng.lat, latLng.lng] });
  };

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issues",
    fetcher,
    { refreshInterval: 10000 }
  );

  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPriority, setSelectedPriority] = useState(
    selectedRow.priority
  );
  let issue = {};
  const uniqueId = self.crypto.randomUUID();
  const [form] = Form.useForm();
  form.setFieldsValue({ "Unique Id": uniqueId });

  const handlePriorityChange = (e) => {
    setSelectedPriority(e);
    setEditedRow({
      ...editedRow,
      priority: e,
    });
  };
  const handleStatusChange = (e) => {
    form.setFieldValue({ status: e });
    setEditedRow({
      ...editedRow,
      status: e,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const errormsg = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const warning = (msg) => {
    messageApi.open({
      type: "warning",
      content: msg,
    });
  };
  const handleUpdate = () => {
    selectedRow = editedRow;
    toggleEditMode();
    fetch(
      `https://digifield.onrender.com/issues/update-issue/${selectedRow.issue_id}`,
      {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(editedRow),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledge) {
          success("Issue has been Updated");
        } else {
          warning(data.description);
        }
        console.log(JSON.stringify(editedRow));
      });
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };
  const handleConfirmDelete = () => {
    console.log("Deleting issue...");
    fetch(
      `https://digifield.onrender.com/issues/delete-issue/${selectedRow.issue_id}`,
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledge) {
          success("Issue has been deleted");
          onClose();
        } else {
          errormsg("There was an error deleting this issue");
          warning(data.description);
        }
      });
    setIsDeleteModalVisible(false);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const reportedTime = new Date(selectedRow.reported_time);
  const formattedDate = `${
    reportedTime.getMonth() + 1
  }/${reportedTime.getDate()}/${reportedTime.getFullYear()}`;
  let hours = reportedTime.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  if (hours > 12) {
    hours -= 12;
  }
  const formattedTime = `${hours}:${String(reportedTime.getMinutes()).padStart(
    2,
    "0"
  )}:${String(reportedTime.getSeconds()).padStart(2, "0")} ${amPm}`;

  return (
    <Drawer
      title={selectedRow.issue_id}
      visible={open}
      onClose={() => {
        console.log("Drawer is closing");

        onClose();
      }}
      width="50%"
      placement="right"
      extra={
        <Space>
          {isEditing ? (
            <>
              <Button onClick={handleUpdate}>Update</Button>
              <Button onClick={toggleEditMode}>Cancel</Button>
            </>
          ) : (
            <Button onClick={toggleEditMode}>Edit</Button>
          )}
          <Button onClick={handleDelete}>
            <MdDeleteOutline />
          </Button>
          <Modal
            title="Confirm Delete"
            visible={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            onClose={onClose}
          >
            Are you sure you want to delete this issue?
          </Modal>
        </Space>
      }
    >
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col bg-white overflow-y-auto w-[45%] pr-5">
          {isEditing ? (
            <div>
              <div className="flex flex-row">
                <div className="w-full h-full">
                  <Input
                    type="text"
                    value={editedRow.remarks}
                    onChange={(e) => {
                      setEditedRow({
                        ...editedRow,
                        remarks: e.target.value,
                      });
                    }}
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />

                  <textarea
                    value={editedRow.description}
                    onChange={(e) => {
                      setEditedRow({
                        ...editedRow,
                        description: e.target.value,
                      });
                    }}
                    className="w-full p-2 mt-2 rounded-lg border border-gray-300 "
                    rows="4"
                  />
                </div>
              </div>
              <div className="pt-5 flex flex-row justify-between">
                <p className="text-sm text-gray-500 mt-2">
                  {formattedDate} {formattedTime}
                </p>
                <Button
                  type="default"
                  className="p-1"
                  onClick={() => setmapModalOpen(true)}
                >
                  <MdLocationPin className="text-2xl mb-2 text-red-600" />
                </Button>
                {mapModalOpen ? (
                  <div>
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
                            <label
                              htmlFor="latitude"
                              className="mb-2 text-[#333] font-light"
                            >
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
                  </div>
                ) : (
                  ""
                )}
              </div>
              <Divider />

              <div>
                <Select
                  defaultValue={selectedPriority}
                  style={{ width: 120 }}
                  onChange={handlePriorityChange}
                  options={[
                    { value: "high", label: "high" },
                    { value: "medium", label: "medium" },
                    { value: "low", label: "low" },
                  ]}
                />
              </div>
              <Divider />
              <div className="flex items-center">
                <PiFolderOpenFill className="text-2xl fill-[#8596A0]" />
                <p className="ml-2">Malfunctions</p>
              </div>
              <Divider />
              <div className="flex flex-row justify-between">
                <Select
                  defaultValue={selectedRow.status}
                  style={{ width: 120 }}
                  onChange={handleStatusChange}
                  options={[
                    { value: "open", label: "open" },
                    { value: "closed", label: "closed" },
                  ]}
                />
              </div>
              <Divider />
              <div className="flex items-center">
                <BiSolidUser className="text-2xl fill-[#8596A0]" />
                <p className="ml-2">{selectedRow.assigned_to}</p>
              </div>
              <Divider />
              <div>
                <h1>Media,Links and docs</h1>
                <div className="bg-white rounded p-3 h-[200px] overflow-hidden">
                  <Carousel
                    prevArrow={
                      <Button className="carousel-arrow">Previous</Button>
                    }
                    nextArrow={<Button className="carousel-arrow">Next</Button>}
                  >
                    {temp.map((i, index) => {
                      return (
                        <div key={index}>
                          <Image width={100} src={i} />
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
              <Divider />
            </div>
          ) : (
            <div>
              <div className="flex flex-row">
                <div>
                  <div>
                    <h1 className="font-semibold text-xl">
                      {editedRow.remarks}
                    </h1>
                    <p className="pt-2 pr-5">{editedRow.description}</p>
                  </div>
                </div>
              </div>
              <div className="pt-5 flex flex-row justify-between">
                <p className="text-sm text-gray-500 mt-2">
                  {formattedDate} {formattedTime}
                </p>

                <MdLocationPin className="text-3xl font-bold fill-[#D00808]" />
              </div>
              <Divider />

              <div className="flex items-center">
                <BsFillBookmarkFill
                  className={`text-2xl ${
                    selectedPriority === "high"
                      ? "text-red-600"
                      : selectedPriority === "medium"
                      ? "text-orange-500"
                      : selectedPriority === "low"
                      ? "text-green-500"
                      : ""
                  }`}
                />
                <p className="ml-2">{editedRow.priority}</p>
              </div>
              <Divider />
              <div className="flex items-center">
                <PiFolderOpenFill className="text-2xl fill-[#8596A0]" />
                <p className="ml-2">Malfunctions</p>
              </div>
              <Divider />
              <div className="flex flex-row justify-between">
                <Select
                  defaultValue={editedRow.status}
                  style={{ width: 120 }}
                  options={[
                    { value: "open", label: "open" },
                    { value: "closed", label: "closed" },
                  ]}
                />
              </div>

              <Divider />
              <div className="flex items-center">
                <BiSolidUser className="text-2xl fill-[#8596A0]" />
                <p className="ml-2">{editedRow.assigned_to}</p>
              </div>
              <Divider />
              <div>
                <h1>Media,Links and docs</h1>
                <div className="bg-white rounded p-3 h-[200px] overflow-hidden">
                  <Carousel
                    prevArrow={
                      <Button className="carousel-arrow">Previous</Button>
                    }
                    nextArrow={<Button className="carousel-arrow">Next</Button>}
                  >
                    {temp.map((i, index) => {
                      return (
                        <div key={index}>
                          <Image width={100} src={i} />
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
              <Divider />
            </div>
          )}
        </div>
        <div className="flex bg-[#E9EDF6] w-[55%] h-full overflow-y-auto">
          <Chat issue={editedRow} />
        </div>
      </div>
    </Drawer>
  );
};
export default IssueDrawer;
