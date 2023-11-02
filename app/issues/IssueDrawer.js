"use client"
import { React, useState, useEffect } from "react";
import {
  Drawer,
  Divider,
  Carousel,
  Button,
  Modal,Image,
  Popover,
  message,
  Space,
  Select,
  Form,
  Upload,
  Input,
} from "antd";
import Chat from "./Chat";
import { EditOutlined } from "@ant-design/icons";
import { MdLocationPin } from "react-icons/md";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { PiFolderOpenFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { DownOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation"; 
import useSWR from "swr";
import image from "next/image";
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
  const [latLng, setLatLng] = useState({
    lat: 12.99097225692328,
    lng: 80.17281532287599,
  });
 //Map view code
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
 
 
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPriority, setSelectedPriority] = useState(
    selectedRow.priority
  );
  let issue = {};
  const uniqueId = self.crypto.randomUUID();
  const [form] = Form.useForm();
  form.setFieldsValue({ "Unique Id": uniqueId });

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    form.setFieldsValue({ priority: e.target.value });
  };
  const handleStatusChange = (e) => {
    form.setFieldValue({ status: e.target.value });
  };

  // function UpdateMapPosition({ setLatLng, field }) {
  //   const map = useMap();
  //   map.on("click", function (e) {
  //     let temp = { ...assetValues };
  //     temp.type_fields[field.field_name] = e.latlng;
  //     setassetValues({ ...assetValues, temp });
  //   });
  //   return null;
  // }

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = () => {
    selectedRow = editedRow;
    toggleEditMode();
    onFinishEvent();
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

  const onFinishEvent = (value) => {
    let temp = {};
    for (let key in value) {
      if (key === "remarks") {
        issue.remarks = value[key];
      } else if (key === "description") {
        issue.description = value[key];
      } else if (key === "priority") {
        issue.priority = value[key];
      } else if (key === "status") {
        issue.status = value[key];
      } else {
        temp[`${key}`] = value[key];
      }
    }

    issue.reported_by = "employee@blunav.in";
    issue.reported_time = 1635249073607;
    issue.type = "observation";
    issue.issue_id = selectedRow.issue_id;
    issue.asset = ["gowtham"];
    issue.deadline = 1635249073607;
    issue.assigned_to = "jerry@blunav.in";
    issue.channel = "mobile";
    issue.location = [];
    issue.images = [];
    issue.issue_occurence_time = 1635249073607;
    issue.docs = [];
    console.log(issue);
    console.log(JSON.stringify(issue));
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
        body: JSON.stringify(issue),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledge) {
          success("Issue has been created");
        } else {
          warning(data.description);
        }
      });
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
      <div className="flex fixedflex-row h-screen overflow-hidden">
        <div className="flex flex-col bg-white overflow-y-auto w-[45%] pr-5">
          {isEditing ? (
            <Form form={form} onFinish={onFinishEvent}>
              <div>
                <div className="flex flex-row">
                  <div>
                    <Form.Item
                      name="remarks"
                      rules={[
                        {
                          required: true,
                          message: "Please type the asset name",
                        },
                      ]}
                    >
                      <div className="w-full h-full">
                        <input
                          type="text"
                          value={editedRow.remarks}
                          onChange={(e) => {
                            form.setFieldsValue({ remarks: e.target.value });
                            setEditedRow({...editedRow,remarks: e.target.value})
                          }}
                          className="w-full p-2 rounded-lg border border-gray-300"
                          placeholder="Remarks"
                        />
                        <textarea
                          value={editedRow.description}
                          onChange={(e) => {
                            form.setFieldsValue({
                              description: e.target.value,
                            });
                            setEditedRow({...editedRow,description: e.target.value})
                          }}
                          className="w-full p-2 mt-2 rounded-lg border border-gray-300 "
                          placeholder="Description"
                          rows="4"
                        />
                      </div>
                    </Form.Item>
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
      open={open}
      onOk={() => setmapModalOpen(false)}
      onCancel={() => setmapModalOpen(false)}
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
              value={selectedRow.location[0]}
              onChange={(e) => {
                const latitude = parseFloat(e.target.value);
                setEditedRow({
                  ...editedRow,
                  location: [latitude, editedRow.location[1]],
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
              value={selectedRow.location[1]}
              onChange={(e) => {
                const longitude = parseFloat(e.target.value);
                setEditedRow({
                  ...editedRow,
                  location: [editedRow.location[0], longitude],
                });
              }}
            />
          </div>
        </div>
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
              <Image src="/normal.png" className="border" width={100} height={100} alt="Satellite View" />
            ) : (
              <Image src="/satellite.png" className="border" width={100} height={100} alt="Normal View" />
            )}
          </div>
          
        {locations.map((locData, index) => {
          console.log(locData);
          return(
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
        );})}
      </MapContainer>
    </div>
      </div>
    </Modal>
  </div>
) : (
  ""
)}
                </div>
                <Divider />
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Please type the asset name",
                    },
                  ]}
                >
                  <div>
                    <Select
                      defaultValue={selectedPriority}
                      style={{ width: 120 }}
                      onChange={handlePriorityChange}
                      options={[
                        { value: "High", label: "High" },
                        { value: "Medium", label: "Medium" },
                        { value: "Low", label: "Low" },
                      ]}
                    />
                  </div>
                </Form.Item>
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
                      nextArrow={
                        <Button className="carousel-arrow">Next</Button>
                      }
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
            </Form>
          ) : (
            <div>
              <div className="flex flex-row">
                <div>
                  <div>
                    <h1 className="font-semibold text-xl">
                      {selectedRow.remarks}
                    </h1>
                    <p className="pt-2 pr-5">{selectedRow.description}</p>
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
                <p className="ml-2">{selectedRow.priority}</p>
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
          )}
        </div>
        <div className="bg-[#E9EDF6] w-[55%] h-full overflow-y-auto">
          {/* <Chat /> */}
        </div>
      </div>
    </Drawer>
  );
};

export default IssueDrawer;
