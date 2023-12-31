"use client";
import { React, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import 'leaflet-geosearch/assets/css/leaflet.css';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import dayjs from "dayjs";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Spin,
  Checkbox,
  DatePicker,
  InputNumber,
  QRCode,
} from "antd";
import useSWR from "swr";
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

//gps function to update position
function UpdateMapPosition({ setLatLng }) {
  const map = useMap();
  map.on("click", function(e) {
    setLatLng(e.latlng);
  });
  return null;
}

const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const downloadQRCode = () => {
  const canvas = document.getElementById("myqrcode")?.querySelector("canvas");
  if (canvas) {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.download = "QRCode.png";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export default function AssetCreate() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [createPressed, setcreatePressed] = useState(false);
  const [assetCreated, setassetCreated] = useState(false);
  const [assetType, setassetType] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [assetValues, setassetValues] = useState({});
  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 10000 }
  );

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
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setcreatePressed(true)
    let temp = {};
    let asset = {};
    console.log(values);
    for (let key in values) {
      if (key === "asset_name") {
        asset.asset_name = values[key];
      } else if (key === "Unique Id") {
        asset.asset_id = values[key];
      } else if (key === "department") {
        asset.department = values[key];
      } else if (key === "assetType") {
        asset.type = values[key];
      } else {
        temp[`${key}`] = values[key];
      }
    }
    console.log(temp);
    asset.type_fields = temp;
    console.log(asset);
    fetch("https://digifield.onrender.com/assets/create-asset", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(asset),
    })
      .then((res) => res.json())
      .then((data) => {
        setcreatePressed(false);
        if (data.acknowledge) {
          success("Asset has been created");
          setassetCreated(true);
        } else {
          warning(data.description);
        }
      });
  };

  if (error)
    return (
      <div>
        <Result
          status="warning"
          title="There are some problems with Loading the fields."
        />
      </div>
    );
  if (isLoading)
    return (
      <div className="w-full h-screen flex flex-col justify-center align-middle">
        <Spin indicator={antIcon} />
        {/* <Loading/> */}
      </div>
    );

  const getField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e.target.value });
            }}
          />
        );
      case "number":
        return (
          <InputNumber
            min={0}
            max={10000}
            onChange={(n) => {
              setassetValues({ ...assetValues, [field.field_name]: n });
              form.setFieldsValue({ [field.field_name]: n });
            }}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            onChange={(e) => {
              setassetValues({
                ...assetValues,
                [field.field_name]: e.target.value,
              });
              form.setFieldsValue({ [field.field_name]: e.target.value });
            }}
          ></Checkbox>
        );
      case "tags":
        return (
          <Select
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Please select"
            onChange={(val) => {
              setassetValues({ ...assetValues, [field.field_name]: val });
              form.setFieldsValue({ [field.field_name]: val });
            }}
            options={() => {
              return field.values.map((val) => {
                return { lebel: val, value: val };
              });
            }}
          />
        );

      case "select":
        return (
          <Select
            allowClear
            onChange={(val) => {
              setassetValues({ ...assetValues, [field.field_name]: val });
              form.setFieldsValue({ [field.field_name]: val });
            }}
          >
            {field.values.map((val, i) => {
              return <Option value={val}>{val}</Option>;
            })}
          </Select>
        );
        case "gps":
          
          return (
            <div>
              
              { latLng && 
                <div>
                  Selected Latitude: {latLng.lat}, Longitude: {latLng.lng}
                 
                </div>
              }
              <div style={{ display: "flex", justifyContent: "space-between" }} className="mb-5">
        <div style={{ flex: 1, marginRight: "10px" }}>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
          //  value={latLng.lat}
           onChange={(val) => setLatLng([val, latLng.lng])}
            style={{
              padding: "4px",
              border: "1px solid grey",
              borderRadius: "5px", 
              width: "100%",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
          //  value={latLng.lng}
           onChange={(val) => setLatLng([latLng.lat, val])}
            style={{
              padding: "4px",
              border: "1px solid grey",
              borderRadius: "5px", 
              width: "100%",
            }}
          />
        </div>
        <Button type="primary" className="">
          Update
        </Button>
      </div>
              <MapContainer                
                center={[12.99097225692328,  80.17281532287599]}
                zoom={13}
                style={{ width: '100%', height: '300px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={latLng != null ? [latLng.lat, latLng.lng]: [12.99097225692328,  80.17281532287599]}></Marker>
                <UpdateMapPosition setLatLng={setLatLng} />
              </MapContainer>
            </div>
          );

        

      case "date":
        return (
          <DatePicker
            onChange={(date, dateString) => {
              form.setFieldsValue({
                [field.field_name]: date != null ? date.unix() : null,
              });
            }}
          />
        );
    }
  };

  return (
    <div className="w-full h-screen overflow-clip flex flex-col pl-20 pr-20 pt-10 pb-0">
      {contextHolder}
      <h1 className="text-xl font-semi bold mb-5">Create New Asset</h1>
      <div className="bg-white w-full h-full flex p-10">
        <div className="w-2/3 h-full flex flex-col overflow-y-auto mr-3">
          <form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item
              name="asset_name"
              rules={[
                {
                  required: true,
                  message: "Please type the asset name",
                },
              ]}
            >
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Asset Name<span className="text-red-600">*</span>
                </h2>
                <Input
                  placeholder="Enter Asset Name"
                  onChange={(e) => {
                    form.setFieldsValue({ asset_name: e.target.value });
                  }}
                />
                
              </div>
            </Form.Item>
            {/* Department */}
            <Form.Item
              name="department"
              rules={[
                {
                  required: true,
                  message: "Please select department",
                },
              ]}
            >
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Department<span className="text-red-600">*</span>
                </h2>
                <Select
                  placeholder="Select department..."
                  allowClear
                  onChange={(val) => {
                    form.setFieldsValue({ department: val });
                  }}
                >
                  {data.map((type, i) => {
                    return <Option value={type.name}>{type.name}</Option>;
                  })}
                </Select>
              
              </div>
            </Form.Item>

            {/* Select asset type */}
            <Form.Item
              name="assetType"
              rules={[
                {
                  required: true,
                  message: "Please select the asset type",
                },
              ]}
            >
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Select asset type <span className="text-red-600">*</span>
                </h2>
                <Select
                  allowClear
                  placeholder="Select Type..."
                  onChange={(val) => {
                    form.setFieldsValue({ assetType: val });
                    fetch(
                      `https://digifield.onrender.com/assets/get-asset-type/${val}`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        setassetType(data);
                      });
                  }}
                >
                  {data.map((type, i) => {
                    return <Option value={type.name}>{type.name}</Option>;
                  })}
                </Select>
              </div>
            </Form.Item>
            {assetType != null &&
              assetType.fields &&
              assetType.fields.map((field) => {
                return (
                  <div>
                    <h1 className="text-[#828282] mb-2 ">
                      {field.section_name}
                    </h1>
                    {field.fields.map((val, i) => {
                      return (
                        <Form.Item
                          name={val.field_name}
                          rules={[
                            {
                              required: val.required,
                              message: "This is a mandatory field",
                            },
                          ]}
                        >
                          <div>
                            <h2 className="mb-2 text-[#333]  font-light">
                              {val.field_name}
                              {val.required && (
                                <span className="text-red-600">*</span>
                              )}
                            </h2>
                            {getField(val)}
                          </div>
                        </Form.Item>
                      );
                    })}
                  </div>
                );
              })}
            {/* button */}
            <div className="flex justify-between">
              <div className="flex">
                <Form.Item>
                  <Button
                    disabled={createPressed || assetCreated}
                    loading={createPressed}
                    type="primary"
                    htmlType="submit"
                    className="mr-3 mt-3 mb-3"
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      router.push("/assets");
                    }}
                    style={{ background: "white" }}
                    className="mr-3 mt-3 mb-3"
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </div>
              <Form.Item>
                <div id="myqrcode">
                  <QRCode
                    className="hidden"
                    value={assetCreated ? form.getFieldsValue('Unique Id') : ""}
                    bgColor="#fff"
                    style={{
                      marginBottom: 16,
                    }}
                  />
                  <Button
                  className=" mr-3 mt-3 mb-3"
                    disabled={!assetCreated}
                    type="primary"
                    onClick={downloadQRCode}
                  >
                    Download QRCode
                  </Button>
                </div>
              </Form.Item>
            </div>
          </form>
        </div>
        {/* image and file upload */}
        <div className="w-1/3">
          <div className="flex flex-col w-full">
            <div className="mb-2">
              <p>Add Images</p>
            </div>


            <Dragger {...props}>
              <p className="ant-upload-drag-icon ">
                <FileImageOutlined style={{ color: "#828282" }} />
              </p>
              <p className="ant-upload-text"></p>
              <p className="ant-upload-hint p-3">Drag image here or browse</p>
            </Dragger>
            
          </div>
          <div className="flex flex-col w-full mt-2">
            <div className="mb-2">
              <p>Add document</p>
            </div>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon ">
                <FileImageOutlined style={{ color: "#828282" }} />
              </p>
              <p className="ant-upload-text"></p>
              <p className="ant-upload-hint p-3">Drag Pdf here or browse</p>
            </Dragger>
          </div>
        </div>
      </div>
    </div>
  );
}
