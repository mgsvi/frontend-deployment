"use client";
import { React, useState, useEffect } from "react";
import {
  Divider,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Modal,
  message,
} from "antd";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
function reportissue({ params }) {
  const router = useRouter();
  const handleChange = (value) => {
    console.log(value.label);
    setcreate(true);
    settype(value.label);
    form.setFieldValue({ type: value });
  };
  const handleChange2 = (value) => {
    console.log(value);
    form.setFieldsValue({ asset: value });
  };
  const handleChange3 = (value) => {
    console.log(value);
  };
  const { TextArea } = Input;
  const uniqueId = self.crypto.randomUUID();
  const [name, setname] = useState(params.issue);
  const [type, settype] = useState("");
  const [typename, settypename] = useState("");
  const [create, setcreate] = useState(false);
  const [assetname, setassetname] = useState("");
  const [form] = Form.useForm();
  const [mode, setMode] = useState(false);
  form.setFieldsValue({ "Unique Id": uniqueId });
  let issue = {};
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [latLng, setLatLng] = useState([12.99097225692328, 80.17281532287599]);
  const [messageApi, contextHolder] = message.useMessage();

  const UpdatePosition = () => {
    const map = useMapEvents({
      moveend: () => {
        setPosition([map.getCenter().lat, map.getCenter().lng]);
      },
    });
    return null;
  };
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const handleCancel = () => setPreviewOpen(false);
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  function UpdateMapPosition({ setLatLng }) {
    const map = useMap();
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      setLatLng([lat, lng]);
    });
    return null;
  }

  const handleChange1 = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const warning = (msg) => {
    messageApi.open({
      type: "warning",
      content: msg,
    });
  };
  const onFinishEvent = (value) => {
    let temp = {};
    for (let key in value) {
      if (key === "remarks") {
        issue.remarks = value[key];
      } else if (key === "description") {
        issue.description = value[key];
      }
      else if (key === "location") {
        issue.location = value[key];
      } else {
        temp[`${key}`] = value[key];
      }
    }
    issue.type = type;
    issue.issue_id = name;
    issue.reported_by = "employee@blunav.in";
    issue.reported_time = 1635249073607;
    issue.status = "open";
    issue.asset = "gowtham";
    issue.deadline = 1635249073607;
    issue.assigned_to = "jerry@blunav.in";
    issue.priority = "low";
    issue.channel = "mobile";
    issue.images = [];
    issue.docs = [];
    console.log(issue);
    console.log(JSON.stringify(issue));
    fetch("https://digifield.onrender.com/issues/create-issue", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
       "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(issue),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledge) {
          success("Issue has been created");
        } else {
          warning(data.description);
        }
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      location: latLng,
    });
  }, [latLng]);

  useEffect(() => {
    fetch(`https://digifield.onrender.com/issues/get-all-issue-categories`)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        settypename(names);
      });
  }, []);

  useEffect(() => {
    fetch(`https://digifield.onrender.com/assets/get-all-assets`)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => ({
          value: item.asset_name,
          label: item.asset_name,
        }));
        setassetname(names);
      });
  }, []);

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div className="px-10 pt-10 ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              type="text"
              ghost
              icon={<LeftOutlined />}
              onClick={() => router.push(`/issues`)}
            ></Button>

            <h1 className="text-xl font-semi font-medium">Report issue</h1>
          </div>
        </div>
        <Divider className="bg-[##BFC6D4] border" />
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[700px]">
          <Form form={form} onFinish={onFinishEvent}>
            <div className="bg-white p-6 rounded-lg  items-center">
              <Form.Item name="">
                <div>
                  <h2 className="mb-2 text-[#333] text-lg">
                    Issue Name<span className="text-red-600">*</span>
                  </h2>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                  />
                </div>
              </Form.Item>
            </div>

            <div className="bg-white mt-5 p-6 rounded-lg  items-center">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please type the issue name",
                  },
                ]}
              >
                <div>
                  <h1 className="text-xl mb-2">What type of issue?</h1>
                  <h2 className="mb-4 text-[#333] text-lg">
                    Category<span className="text-red-600">*</span>
                  </h2>
                  <Select
                    className="w-full"
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={filterOption}
                    labelInValue
                    defaultValue={{
                      label: "select category",
                    }}
                    style={{
                      width: 650,
                    }}
                    onChange={handleChange}
                    options={typename}
                  />
                </div>
              </Form.Item>
            </div>
            {create && (
              <div className="bg-white p-6 mb-5 rounded-lg mt-5 items-center">
                <div className="flex flex-row">
                  <div>
                    <Input
                      value={type}
                      className=" bg-[#D2D2D2] "
                      onChange={(e) => {
                        form.setFieldsValue({ type: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Please type the asset name",
                    },
                  ]}
                >
                  <div className="mt-5">
                    <Input
                      className="text-2xl"
                      placeholder="Add Title"
                      onChange={(e) => {
                        form.setFieldsValue({ remarks: e.target.value });
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please type the asset name",
                    },
                  ]}
                >
                  <div className="mt-5">
                    <TextArea
                      // onChange={(e) => setValue(e.target.value)}
                      placeholder="Add description of what happened"
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                      onChange={(e) => {
                        form.setFieldsValue({ description: e.target.value });
                      }}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  name="images"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please type the asset name",
                  //   },
                  // ]}
                >
                  <div className="mt-5 flex flex-row ">
                    <div>
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange1}
                      >
                        {fileList.length >= 8 ? null : uploadButton}
                      </Upload>
                      <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                      >
                        <img
                          alt="example"
                          style={{
                            width: "100%",
                          }}
                          src={previewImage}
                        />
                      </Modal>
                    </div>
                    <div className="flex items-center justify-center">
                      <p>Add up to 5 photos</p>
                    </div>
                  </div>
                </Form.Item>
                <Divider />
                <Form.Item
                  name="asset"
                  rules={[
                    {
                      required: true,
                      message: "Please type the asset name",
                    },
                  ]}
                >
                  <div>
                    <h2 className="mb-4 text-[#333] text-lg">
                      Assets<span className="text-red-600">*</span>
                    </h2>
                    <Select
                      mode="tags"
                      style={{
                        width: "100%",
                      }}
                      placeholder="Select Assets"
                      onChange={handleChange2}
                      options={assetname}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  name="location"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please type the asset name",
                  //   },
                  // ]}
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
                          value={latLng[0]}
                          onChange={(e) => {
                            const newLat = e.target.value
                              ? parseFloat(e.target.value)
                              : null;
                            setLatLng([newLat, latLng[1]]);
                            form.setFieldsValue({
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
                          value={latLng[1]}
                          onChange={(e) => {
                            const newLng = e.target.value
                              ? parseFloat(e.target.value)
                              : null;
                            setLatLng([latLng[0], newLng]);
                            form.setFieldsValue({
                              location: [latLng[0], newLng],
                            });
                          }}
                        />
                      </div>
                    </div>
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
                </Form.Item>
                <Form.Item
                  name="site"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please type the asset name",
                  //   },
                  // ]}
                >
                  <div>
                    <h2 className="mb-4 mt-5 text-[#333] text-lg">
                      Site<span className="text-red-600">*</span>
                    </h2>
                    <Select
                      mode="tags"
                      style={{
                        width: "100%",
                      }}
                      placeholder="Select Assets"
                      onChange={handleChange3}
                      options={assetname}
                    />
                  </div>
                </Form.Item>
                <div className=" flex justify-end">
                  <Button
                    type="primary"
                    ghost
                    className="mr-5 w-[20%] mt-5"
                    style={{ background: "white" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    className=" w-[20%] mt-5 mb-10"
                    htmlType="submit"
                    onClick={() => {
                      router.push("/issues");
                    }}
                  >
                    Report Issue
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default reportissue;
