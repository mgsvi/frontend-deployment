"use client";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
//gps function to update position


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

//const[locations, setlocation] = useState{[]}

export default function AssetEdit({ params }) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [updatePressed, setUpdatePressed] = useState(false);
  const [assetType, setassetType] = useState(null);
  const [assetValues, setassetValues] = useState({});
  const [form] = Form.useForm();
  const [latLng, setLatLng] = useState({
    lat: 12.99097225692328,
    lng: 80.17281532287599,
  });

  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 10000 }
  );
  function UpdateMapPosition({ setLatLng, field }) {
    const map = useMap();
    map.on("click", function (e) {
      let temp = { ...assetValues };
      temp.type_fields[field.field_name] = e.latlng;
      setassetValues({ ...assetValues, temp });
    });
    return null;
  }

  const getKeyName = (key) => {
    if (key === "asset_name") {
      return "asset_name";
    } else if (key === "Unique Id") {
      return "asset_id";
    } else if (key === "department") {
      return "department";
    } else if (key === "assetType") {
      return "type";
    } else {
      return "type_field";
    }
  };
 
  
  useEffect(() => {
    fetch(
      `https://digifield.onrender.com/assets/get-assets-by-id/${params.asset}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          setassetValues(data);
          fetch(
            `https://digifield.onrender.com/assets/get-asset-type/${data.type}`
          )
            .then((res) => res.json())
            .then((typeOfAsset) => {
              setassetType(typeOfAsset);
              form.setFieldsValue({
                asset_name: data.asset_name,
                assetType: data.type,
                department: data.type,
                "Unique Id": data.asset_id,
              });
              for (let i of Object.keys(data.type_fields)) {
                if (i == "Unique Id") {
                } else {
                  form.setFieldsValue({
                    [i]: data.type_fields[i],
                  });
                }
              }
            });
        }
      });
  }, [data]);

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



  const onFinish = (values) => {
    setUpdatePressed(true);
    fetch(
      `https://digifield.onrender.com/assets/update-asset/${assetValues.asset_id}`,
      {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(assetValues),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUpdatePressed(false);
        console.log(form.getFieldValue("Status"));
        if (data.acknowledge) {
          success("Asset has been updated");
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
            required={field.required}
            disabled={field.field_name == "Unique Id" ? true : false}
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)]
                : assetValues.type_fields[field.field_name]
            }
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e.target.value });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: e.target.value,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                console.log(newValue);
                setassetValues(newValue);
              } else {
                setassetValues({
                  ...assetValues,
                  [field.field_name]: e.target.value,
                });
              }
            }}
          />
        );
      case "number":
        return (
          <InputNumber
            required={field.required}
            min={0}
            max={10000}
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)]
                : assetValues.type_fields[field.field_name]
            }
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: e,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                console.log(newValue);
                setassetValues(newValue);
              } else {
                setassetValues({ ...assetValues, [field.field_name]: e });
              }
            }}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            required={field.required}
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)]
                : assetValues.type_fields[field.field_name]
            }
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: e,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                console.log(newValue);
                setassetValues(newValue);
              } else {
                setassetValues({ ...assetValues, [field.field_name]: e });
              }
            }}
          ></Checkbox>
        );
      case "tags":
        return (
          <Select
            required={field.required}
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Please select"
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)]
                : assetValues.type_fields[field.field_name]
            }
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: e,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                console.log(newValue);
                setassetValues(newValue);
              } else {
                setassetValues({ ...assetValues, [field.field_name]: e });
              }
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
            required={field.required}
            allowClear
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)]
                : assetValues.type_fields[field.field_name]
            }
            onChange={(e) => {
              form.setFieldsValue({ [field.field_name]: e });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: e,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                console.log(newValue);
                setassetValues(newValue);
              } else {
                setassetValues({ ...assetValues, [field.field_name]: e });
              }
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
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
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
                  value={assetValues.type_fields[field.field_name].lat}
                  onChange={(e) => {
                    let temp = { ...assetValues };
                    temp.type_fields[field.field_name].lat = e.target.value;
                    setassetValues({ ...assetValues, temp });
                    if (e.target.value === "") {
                      setLatLng({ ...latLng, lat: 12.99097225692328 });
                    } else {
                      setLatLng({ ...latLng, lat: parseFloat(e.target.value) });
                    }
                    form.setFieldsValue({ [field.field_name]: latLng });
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
                  value={assetValues.type_fields[field.field_name].lng}
                  onChange={(e) => {
                    let temp = { ...assetValues };
                    temp.type_fields[field.field_name].lng = e.target.value;
                    setassetValues({ ...assetValues, temp });
                    if (e.target.value === "") {
                      setLatLng({ ...latLng, lng: 80.17281532287599 });
                    } else {
                      setLatLng({ ...latLng, lng: parseFloat(e.target.value) });
                    }
                    form.setFieldsValue({ [field.field_name]: latLng });
                  }}
                />
              </div>
            </div>
            <MapContainer
              center={
                assetValues.type_fields[field.field_name].lat != null && assetValues.type_fields[field.field_name].lng != null
                  ? [assetValues.type_fields[field.field_name].lat, assetValues.type_fields[field.field_name].lng]
                  : [12.99097225692328, 80.17281532287599]
              }
              zoom={13}
              style={{ width: "100%", height: "300px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={
                  assetValues.type_fields[field.field_name].lat != null && assetValues.type_fields[field.field_name].lng != null
                    ? [assetValues.type_fields[field.field_name].lat, assetValues.type_fields[field.field_name].lng]
                    : [12.99097225692328, 80.17281532287599]
                }
              ></Marker>
              <UpdateMapPosition
                field={field}
              />
            </MapContainer>
          </div>
        );
      case "date":
        return (
          <DatePicker
            required={field.required}
            value={
              getKeyName(field.field_name) != "type_field"
                ? assetValues[getKeyName(field.field_name)] != null
                  ? dayjs.unix(assetValues[getKeyName(field.field_name)])
                  : null
                : assetValues.type_fields[field.field_name] != null
                ? dayjs.unix(assetValues.type_fields[field.field_name])
                : null
            }
            onChange={(date, dateString) => {
              form.setFieldsValue({ [field.field_name]: dateString });
              if (getKeyName(field.field_name) == "type_field") {
                let temp = {
                  ...assetValues.type_fields,
                  [field.field_name]: date != null ? date.unix() : null,
                };
                let newValue = { ...assetValues };
                newValue.type_fields = temp;
                setassetValues(newValue);
              } else {
                setassetValues({
                  ...assetValues,
                  [field.field_name]: date != null ? date.unix() : null,
                });
              }
            }}
          />
        );
    }
  };

  return (
    <div className="w-full h-screen overflow-clip flex flex-col pl-20 pr-20 pt-10 pb-0">
      {contextHolder}
      <h1 className="text-xl font-semi bold mb-5">Edit Asset</h1>
      <div className="bg-white w-full h-full flex p-10">
        <div className="w-2/3 h-full flex flex-col overflow-y-auto mr-3">
          <Form
            form={form}
            name="control-hooks"
            onFinishFailed={(values) => {
              console.log(values);
            }}
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item name="asset_name">
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Asset Name<span className="text-red-600">*</span>
                </h2>
                <Input
                  placeholder="Enter Asset Name"
                  value={assetValues.asset_name}
                  required
                  onChange={(e) => {
                    setassetValues({
                      ...assetValues,
                      asset_name: e.target.value,
                    });
                    form.setFieldsValue({ asset_name: e.target.value });
                  }}
                />
              </div>
            </Form.Item>
            {/* Department */}
            <Form.Item name="department">
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Department<span className="text-red-600">*</span>
                </h2>
                <Select
                  required
                  placeholder="Select department..."
                  value={assetValues.department}
                  onChange={(val) => {
                    form.setFieldsValue({ department: val });
                    setassetValues({
                      ...assetValues,
                      department: val,
                    });
                  }}
                >
                  {data.map((type, i) => {
                    return <Option value={type.name}>{type.name}</Option>;
                  })}
                </Select>
              </div>
            </Form.Item>

            {/* Select asset type */}
            <Form.Item name="assetType">
              <div>
                <h2 className="mb-2 text-[#333]  font-light">
                  Select asset type <span className="text-red-600">*</span>
                </h2>
                <Select
                  disabled
                  required
                  value={assetValues.type}
                  placeholder="Select Type..."
                  onChange={(val) => {
                    setassetValues({ ...assetValues, type: val });
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
                    disabled={updatePressed}
                    loading={updatePressed}
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
                      router.push(`/assets/${assetValues.asset_id}`);
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
                    value={assetValues.asset_id}
                    bgColor="#fff"
                    style={{
                      marginBottom: 16,
                    }}
                  />
                  <Button
                    className=" mr-3 mt-3 mb-3"
                    type="primary"
                    onClick={downloadQRCode}
                  >
                    Download QRCode
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
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
