"use client";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Space, Modal } from "antd";
import { Col, Row } from "antd";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Divider,
  Spin,
  message,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  PlusOutlined,
  AppstoreOutlined,
  BarsOutlined,
  TagsOutlined,
  NumberOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PartitionOutlined,
  CloseOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EnterOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import FieldsSection from "./FieldsSection";
import useSWR from "swr";

function Page({ params }) {
  const router = useRouter();
  let originalData = {};
  const [updatePressed, setupdatePressed] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [messageApi, contextHolder] = message.useMessage();
  const [addsectionName, setAddSectionName] = useState("");
  const [showAddSection, setshowAddSection] = useState(false);
  const [assetTypeExists, setassetTypeExists] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [assetType, setassetType] = useState({
    name: params.name,
    created_by: "Ana De Armas",
    created_at: Math.floor(Date.now() / 1000),
    asset_zone: null,
    fields: [
      {
        section_name: "SUMMARY FIELDS",
        fields: [
          { field_name: "Unique Id", required: true, type: "text", values: [] },
          { field_name: "Status", required: true, type: "select", values: [] },
          { field_name: "Site", required: false, type: "select", values: [] },
        ],
      },
    ],
  });

  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const error = (msg) => {
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

  const validateFields = () => {
    console.log("validate");
    for (let section of assetType.fields) {
      for (let field of section.fields) {
        if (field.field_name == "" || field.field_name == undefined) {
          warning("Please provide names for each field");
          setupdatePressed(false);
          return false;
        }
        if (field.type == "tags" || field.type == "select") {
          if (field.values.length == 0) {
            warning(`Please provide values for the field ${field.field_name}`);
            setupdatePressed(false);
            return false;
          }
        }
      }
    }
    return true;
  };

  useEffect(() => {
    fetch(`https://digifield.onrender.com/assets/get-asset-type/${params.name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data == null) {
          setassetTypeExists(false);
          console.log(assetTypeExists);
        } else {
          console.log(data);
          originalData = data;
          setassetType(data);
          setassetTypeExists(true);
          setChecked(() => {
            if (data.asset_zone != null) {
              return true;
            } else {
              return false;
            }
          });
        }
        console.log(assetTypeExists);
        setisLoading(false);
      });
  }, []);

  const [isNameEditEnabled, setisNameEditEnabled] = useState(false);
  const [isDateField, setisDateField] = useState(false);

  //Asset Zone related values and Methods
  const [assetZoneUnit, setassetZoneUnit] = useState("m");
  const [checked, setChecked] = useState(
    assetType.asset_zone == null ? false : true
  );

  const onAssetZoneEnabledChange = (e) => {
    let value = 0;
    if (e.target.checked) {
      switch (assetZoneUnit) {
        case "m":
          value = assetType.asset_zone;
          break;
        case "km":
          value = assetType.asset_zone * 1000;
          break;
        case "feet":
          value = assetType.asset_zone * 0.3048;
          break;
        case "cm":
          value = assetType.asset_zone / 100;
          break;
        default:
          break;
      }
      setassetType({ ...assetType, asset_zone: value });
    } else {
      setassetType({ ...assetType, asset_zone: null });
    }
    setChecked(e.target.checked);
  };

  const handleAssetZoneUnitChange = (value) => {
    setassetZoneUnit(value);
  };
  //end of Asset Zone related values and Methods

  return (
    <div className="flex w-full h-screen ">
      {contextHolder}
      <div className="flex flex-col w-2/3 h-screen p-3 overflow-y-auto justify-between">
        {!isLoading ? (
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-8">
              <div className="flex gap-2">
                <Button
                  type="text"
                  ghost
                  icon={<LeftOutlined />}
                  onClick={() => router.push(`/assets/types`)}
                ></Button>
                <h1 className="text-xl font-semi bold">Edit Asset type</h1>
              </div>
              <Popconfirm
                title="Delete the asset type"
                description="Performing this action will remove the asset type, are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  fetch(
                    `https://digifield.onrender.com/assets/delete-asset-type/${assetType.name}`,
                    {
                      method: "DELETE",
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.acknowledge) {
                        success("Asset Type has been deleted");
                        router.push("/assets/types");
                      } else {
                        warning(data.description);
                      }
                    });
                }}
              >
                <button className="text-[#828282] bg-transparent hover:text-black">
                  <EllipsisOutlined rotate={90} />
                </button>
              </Popconfirm>
            </div>
            <div className="flex justify-between mr-3 m">
              {isNameEditEnabled ? (
                <div className="flex">
                  <Input
                    className="text-2xl font-semi bold mr-5"
                    value={assetType.name}
                    onChange={(e) => {
                      setassetType({ ...assetType, name: e.target.value });
                    }}
                  />
                  <button
                    onClick={() => {
                      setisNameEditEnabled(!isNameEditEnabled);
                    }}
                    style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                  >
                    <CheckOutlined />
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <h1 className="text-2xl font-semi bold mr-5">
                    {assetType.name}
                  </h1>
                  <button
                    onClick={() => {
                      setisNameEditEnabled(!isNameEditEnabled);
                    }}
                    style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                  >
                    <EditOutlined />
                  </button>
                </div>
              )}
              <div>
                <Checkbox checked={checked} onChange={onAssetZoneEnabledChange}>
                  <p className="mt-2 mb-2 text-sm text-slate-400 mr-3">
                    Enable inspection zone
                  </p>
                </Checkbox>
                <InputNumber
                  className="mr-3"
                  min={1}
                  max={1000}
                  style={{ width: 60 }}
                  defaultValue={assetType.asset_zone}
                  disabled={!checked}
                  onChange={(val) => {
                    setassetType({ ...assetType, asset_zone: val });
                  }}
                />
                <Select
                  className="mr-3"
                  defaultValue="m"
                  disabled={!checked}
                  style={{ width: 70 }}
                  onChange={handleAssetZoneUnitChange}
                  options={[
                    { value: "m", label: "m" },
                    { value: "cm", label: "cm" },
                    { value: "feet", label: "feet" },
                    { value: "km", label: "km" },
                  ]}
                />
              </div>
            </div>
            <Divider />
            <div className="flex flex-col w-full">
              <div className=" ">
                {assetType.fields.map((val, i) => {
                  return (
                    <div className="">
                      <Row>
                        <Col span={21} lign={"middle"}>
                          <div className="w-full flex justify-between items-center">
                            <h1 className="text-[#828282] mb-2 ">
                              {val.section_name}
                            </h1>
                            {val.section_name != "SUMMARY FIELDS" && (
                              <Popconfirm
                                title="Delete the Section"
                                description="Performing this action will also delete all its fields, are you sure?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => {
                                  let temp = assetType.fields.filter((item) => {
                                    return (
                                      item.section_name !== val.section_name
                                    );
                                  });
                                  setassetType({ ...assetType, fields: temp });
                                }}
                              >
                                <button className="text-[#a1a1a1] bg-transparent hover:text-black">
                                  <DeleteOutlined />
                                </button>
                              </Popconfirm>
                            )}
                          </div>
                        </Col>
                        {val.section_name == "SUMMARY FIELDS" && (
                          <Col span={3} align={"middle"}>
                            <h1 className="text-[#828282]">Required</h1>
                          </Col>
                        )}
                      </Row>
                      {val.fields.map((field, index) => {
                        return (
                          <div className="w-full">
                            <Row align={"middle"} className="mb-3 ">
                              <Col span={21}>
                                <div className="rounded bg-white flex justify-between items-center  ">
                                  <Input
                                    disabled={
                                      val.section_name == "SUMMARY FIELDS" &&
                                      (field.field_name == "Unique Id" ||
                                        field.field_name == "Status" ||
                                        field.field_name == "Site")
                                        ? true
                                        : false
                                    }
                                    className="text-[#828282] font-light"
                                    placeholder="Enter field name"
                                    bordered={false}
                                    value={field.field_name}
                                    onChange={(e) => {
                                      let copy = { ...assetType };
                                      copy.fields[i].fields[index].field_name =
                                        e.target.value;
                                      setassetType({ ...assetType, copy });
                                    }}
                                  />
                                  <div className="flex justify-between w-[200px]">
                                    <Select
                                      defaultValue={field.type}
                                      onChange={(e) => {
                                        let copy = { ...assetType };
                                        copy.fields[i].fields[index].type = e;
                                        setassetType({ ...assetType, copy });
                                      }}
                                      bordered={false}
                                      style={{ width: 150 }}
                                    >
                                      {/* text dropdown */}
                                      <Option value="text">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#fde3cf",
                                                color: "#f56a00",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">U</p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            Text
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* number dropdown */}
                                      <Option value="number">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#FFF3E5",
                                                color: "#EB5757",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <NumberOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            Number
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* checkbox dropdown */}
                                      <Option value="checkbox">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#EFDEFF",
                                                color: "#9B51E0",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <AppstoreOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            Checkbox
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* status dropdown */}
                                      <Option value="tags">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#E0F7FF",
                                                color: "#56CCF2",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <TagsOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            Tags
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* Department */}
                                      <Option value="select">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#ECF4FF",
                                                color: "#2F80ED",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <PartitionOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2 ">
                                            Select
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* Gps dropdown */}
                                      <Option value="gps">
                                        <div className="flex justify-start ">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#FFE9E2",
                                                color: "#F24E1E",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <EnvironmentOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            GPS
                                          </h1>
                                        </div>
                                      </Option>

                                      {/* date dropdown */}
                                      <Option value="date">
                                        <div className="flex justify-start">
                                          <Space wrap>
                                            <Avatar
                                              size={21}
                                              style={{
                                                backgroundColor: "#D2FFE5",
                                                color: "#219653",
                                                fontSize: "12px",
                                              }}
                                            >
                                              <p className="text-sm">
                                                <CalendarOutlined />
                                              </p>
                                            </Avatar>
                                          </Space>
                                          <h1 className="text-[#828282] ml-2  ">
                                            Date
                                          </h1>
                                        </div>
                                      </Option>
                                    </Select>
                                    <Button
                                      type="text"
                                      disabled={
                                        val.section_name == "SUMMARY FIELDS" &&
                                        (field.field_name == "Unique Id" ||
                                          field.field_name == "Status" ||
                                          field.field_name == "Site")
                                          ? true
                                          : false
                                      }
                                      onClick={() => {
                                        let temp = assetType.fields[
                                          i
                                        ].fields.filter(
                                          (item) =>
                                            item.field_name !==
                                            assetType.fields[i].fields[index]
                                              .field_name
                                        );
                                        let copy = { ...assetType };
                                        copy.fields[i].fields = temp;
                                        setassetType({ ...assetType, copy });
                                      }}
                                    >
                                      <CloseOutlined />
                                    </Button>
                                  </div>
                                </div>
                              </Col>
                              <Col span={3} align={"middle"}>
                                <Checkbox
                                  disabled={
                                    val.fields[index].field_name ==
                                      "Unique Id" ||
                                    val.fields[index].field_name == "Status"
                                      ? true
                                      : false
                                  }
                                  checked={
                                    assetType.fields[i].fields[index].required
                                  }
                                  onChange={(e) => {
                                    let copy = { ...assetType };
                                    copy.fields[i].fields[index].required =
                                      e.target.checked;
                                    setassetType({ ...assetType, copy });
                                  }}
                                ></Checkbox>
                              </Col>
                            </Row>
                            {(field.type == "select" ||
                              field.type == "tags") && (
                              <Row className="mb-3">
                                <Col span={10}></Col>
                                <Col span={10}>
                                  <Select
                                    mode="tags"
                                    style={{ width: "100%" }}
                                    placeholder="Enter possible option values"
                                    onChange={(selectedOptions) => {
                                      console.log(selectedOptions);
                                      let copy = { ...assetType };

                                      copy.fields[i].fields[index].values =
                                        selectedOptions;

                                      setassetType({ ...assetType, copy });
                                    }}
                                    defaultValue={field.values.map((val) => {
                                      return { value: val, label: val };
                                    })}
                                  >
                                    {field.values.map((val) => {
                                      return <Option value={val}>{val}</Option>;
                                    })}
                                  </Select>
                                </Col>
                                <Col span={1} align={"middle"}>
                                  <EnterOutlined className="text-[22px] text-[#a1a1a1]" />
                                </Col>
                              </Row>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex">
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                className="mr-5"
                style={{ background: "white" }}
                onClick={() => {
                  let temp = {
                    field_name: "",
                    required: false,
                    type: "text",
                    values: [],
                  };
                  let copy = assetType;
                  copy.fields[copy.fields.length - 1].fields.push(temp);
                  setassetType({ ...assetType, copy });
                }}
              >
                Add custom field
              </Button>
              <Button
                type="primary"
                ghost
                icon={<BarsOutlined />}
                style={{ background: "white" }}
                onClick={() => {
                  setshowAddSection(true);
                }}
              >
                Add section
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Spin indicator={antIcon} />
          </div>
        )}
        <div className="flex w-full justify-end mt-3">
          <Button
            loading={updatePressed}
            disabled={isLoading}
            type="primary"
            className="mb-3 mr-2"
            onClick={() => {
              setupdatePressed(true);
              console.log(JSON.stringify(assetType));
              if (validateFields()) {
                if (assetTypeExists) {
                  fetch(
                    `https://digifield.onrender.com/assets/update-asset-type/${params.name}`,
                    {
                      method: "PUT",
                      mode: "cors",
                      cache: "no-cache",
                      headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                      },
                      body: JSON.stringify(assetType),
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      setupdatePressed(false);
                      if (data.acknowledge) {
                        success("Asset Type has been updated");
                        router.push(`/assets/types/${assetType.name}`);
                      } else {
                        warning(data.description);
                      }
                    })
                    .catch((err) => {
                      error(err.toString());
                      setupdatePressed(false);
                    });
                } else {
                  fetch(
                    "https://digifield.onrender.com/assets/create-asset-type",
                    {
                      method: "POST",
                      mode: "cors",
                      cache: "no-cache",
                      headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                      },
                      body: JSON.stringify(assetType),
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      setupdatePressed(false);
                      if (data.acknowledge) {
                        success("Asset Type has been updated");
                        setassetTypeExists(true);
                      } else {
                        warning(data.description);
                      }
                    })
                    .catch((err) => {
                      error(err.toString());
                    });
                }
              }
            }}
          >
            {assetTypeExists == true ? "Update" : "Create"}
          </Button>
          <Button
            disabled={isLoading}
            className="mb-3 mr-3"
            onClick={() => {
              router.push("/assets/types");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-1/3 bg-[#F8F9FC] p-3 ">
        <FieldsSection setassetType={setassetType} />
      </div>
      <Modal
        title="Add Section"
        visible={showAddSection}
        onOk={() => {
          if (addsectionName == "" || addsectionName == undefined) {
            error("Section name cannot be empty");
            return;
          }
          let temp = { ...assetType };
          temp = temp.fields.push({
            section_name: addsectionName.toUpperCase(),
            fields: [],
          });
          setassetType({ ...assetType, temp });
          setshowAddSection(false);
          setAddSectionName("");
        }}
        onCancel={() => {
          setAddSectionName("");
          setshowAddSection(false);
        }}
      >
        <Input
          placeholder="Enter section name"
          value={addsectionName}
          onChange={(e) => {
            setAddSectionName(e.target.value);
          }}
        />
      </Modal>
    </div>
  );
}
export default Page;
