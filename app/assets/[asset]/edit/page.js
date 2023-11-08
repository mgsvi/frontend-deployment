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
  Result,
} from "antd";
import useSWR from "swr";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  FileImageOutlined,
  LoadingOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Donegal_One } from "next/font/google";

const { Option } = Select;
const { Dragger } = Upload;
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
//gps function to update position

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
  const [imageList, setimageList] = useState([]);
  const [docList, setdocList] = useState([]);

  function UpdateMapPosition({ setLatLng, field }) {
    const map = useMap();
    map.on("click", function (e) {
      let temp = { ...assetValues };
      temp.type_fields[field.field_name] = e.latlng;
      setassetValues({ ...assetValues, temp });
    });
    return null;
  }

  const imageProps = {
    name: "file",
    multiple: true,
    action: `http://localhost:8001/media/uploadfile/assets/${params.asset}`,
    beforeUpload: (file) => {
      let allowedExtension = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ];
      const isIMG = allowedExtension.includes(file.type);
      if (!isIMG) {
        message.error(`${file.name} is not an image`);
      }
      return isIMG || Upload.LIST_IGNORE;
    },
    onChange(info) {
      let newFileList = [...info.fileList];
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        let newAssetValues = { ...assetValues };
        newAssetValues.images.push(info.file.response.url);
        setassetValues(newAssetValues);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      if (status === "removed") {
        let newImages = assetValues.images.filter(
          (img) => img.split("/")[5] != info.file.name
        );
        let copy = { ...assetValues };
        copy.images = newImages;
        setassetValues(copy);
        console.log(data);
      }
      setimageList(newFileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer);
    },
  };

  const docProps = {
    name: "file",
    multiple: true,
    action: `http://localhost:8001/media/uploadfile/assets/${params.asset}`,
    onChange(info) {
      let newFileList = [...info.fileList];
      newFileList = newFileList.map((file) => {
        if (file.response) {
          console.log(file.response);
          file.url = file.response.url;
        }
        return file;
      });
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "removed") {
        let newDocs = assetValues.docs.filter(
          (doc) => doc.split("/")[5] != info.file.name
        );
        let copy = { ...assetValues };
        copy.docs = newDocs;
        setassetValues(copy);
        console.log(data);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        let newAssetValues = { ...assetValues };
        newAssetValues.docs.push(info.file.response.url);
        setassetValues(newAssetValues);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      setdocList(newFileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

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
          let images = data.images.map((i) => {
            return {
              name: i.split("/")[5],
              status: "done",
              url: i,
            };
          });
          setimageList(images);
          let docs = data.docs.map((i) => {
            return {
              name: i.split("/")[5],
              status: "done",
              url: i,
            };
          });
          setdocList(docs);
        }
      });
  }, []);

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
            disabled={field.field_name == "Unique Id"}
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
          >
            {field.values.map((val, i) => {
              return <Option key={i} value={val}>{val}</Option>;
            })}
          </Select>
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
            {field.values.map((val,i) => {
              return <Option key={i} value={val}>{val}</Option>;
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
                assetValues.type_fields[field.field_name].lat != null &&
                assetValues.type_fields[field.field_name].lng != null
                  ? [
                      assetValues.type_fields[field.field_name].lat,
                      assetValues.type_fields[field.field_name].lng,
                    ]
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
                  assetValues.type_fields[field.field_name].lat != null &&
                  assetValues.type_fields[field.field_name].lng != null
                    ? [
                        assetValues.type_fields[field.field_name].lat,
                        assetValues.type_fields[field.field_name].lng,
                      ]
                    : [12.99097225692328, 80.17281532287599]
                }
              ></Marker>
              <UpdateMapPosition field={field} />
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
      <div className="flex gap-2">
        <Button
          type="text"
          ghost
          icon={<LeftOutlined />}
          onClick={() => router.push(`/assets/${params.asset}`)}
        ></Button>
        <h1 className="text-xl font-semi bold mb-5">Edit Asset</h1>
      </div>

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
                    return <Option key={i} value={type.name}>{type.name}</Option>;
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
                    return <Option key={i} value={type.name}>{type.name}</Option>;
                  })}
                </Select>
              </div>
            </Form.Item>
            {assetType != null &&
              assetType.fields.map((field,i) => {
                return (
                  <div key={i}>
                    <h1 className="text-[#828282] mb-2 ">
                      {field.section_name}
                    </h1>
                    {field.fields.map((val, i) => {
                      return (
                        <Form.Item
                        key={i}
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

            <Dragger {...imageProps} fileList={imageList}>
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
            <Dragger {...docProps} fileList={docList}>
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