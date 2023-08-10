"use client";
import { React, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Table,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  SearchOutlined,
  PlusOutlined,
  BarsOutlined,
  UserOutlined,
  NumberOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

function page({ params }) {
  const [assetType, setassetType] = useState({
    name: params.name,
    created_by: "Ana De Armas",
    created_at: Date.now(),
    asset_zone: null,
    fields: [],
  });
  const tableContainerStyle = {
    marginTop: "0px", // Adjust the margin top value as needed to move the table down
  };
  //table data ant design
  const [data, setData] = useState([
    {
      key: 1,
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      description:
        "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
    },
    {
      key: 2,
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      description:
        "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
    },
    {
      key: 3,
      name: "Not Expandable",
      age: 29,
      address: "Jiangsu No. 1 Lake Park",
      description: "This not expandable",
    },
    {
      key: 4,
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      description:
        "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
    },
  ]);

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    Table.EXPAND_COLUMN,
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <EllipsisOutlined rotate={90} />
          </Popconfirm>
        ) : null,
    },
  ];

  const [assetTypeName, setassetTypeName] = useState(params.name);
  const [isNameEditEnabled, setisNameEditEnabled] = useState(false);

  //Asset Zone related values and Methods
  const [assetZone, setAssetZone] = useState(1);
  const [checked, setChecked] = useState(true);

  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  //end of Asset Zone related values and Methods

  //main table
  const handleTypeChange = (value) => {
    console.log("Selected type:", value);
  };

  const handleRequiredChange = (e) => {
    console.log("Is Required:", e.target.checked);
  };

  //Add field modal realted values and methods
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  //dal realted values and methods

  return (
    <div className="flex">
      <div className="flex flex-col w-2/3 p-3">
        <h1 className="text-xl font-semi bold mb-8">Edit Asset type</h1>
        <div className="flex justify-between mr-3 mb-5">
          {isNameEditEnabled ? (
            <div className="flex">
              <Input
                className="text-2xl font-semi bold mr-5"
                value={assetTypeName}
                onChange={(e) => {
                  setassetTypeName(e.target.value);
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
              <h1 className="text-2xl font-semi bold mr-5">{assetTypeName}</h1>
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
            <Checkbox checked={checked} onChange={onChange}>
              <p className="mt-2 mb-2 text-sm text-slate-400 mr-3">
                Enable inspection zone
              </p>
            </Checkbox>
            <InputNumber
              className="mr-3"
              min={1}
              max={1000}
              style={{ width: 60 }}
              defaultValue={1}
              disabled={!checked}
              onChange={(val) => {
                setAssetZone(val);
              }}
            />
            <Select
              className="mr-3"
              defaultValue="m"
              disabled={!checked}
              style={{ width: 70 }}
              onChange={handleChange}
              options={[
                { value: "m", label: "m" },
                { value: "cm", label: "cm" },
                { value: "feet", label: "feet" },
                { value: "km", label: "km" },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full">
            <Row>
              <Col span={21}>
                <h1 className="text-[#828282] ">SUMMARY FIELDS</h1>
              </Col>
              <Col span={3} align={"middle"}>
                <h1 className="text-[#828282] right-0">Required</h1>
              </Col>
            </Row>
          </div>

          <div className="">
            <Row align={"middle"}>
              <Col span={18} className="bg-white">
                <Input
                  placeholder="Enter value"
                  className=""
                  bordered={false}
                />
              </Col>
              <Col span={3} className="bg-white">
                <div>
                  
                </div>
                <Select
                  bordered={false}
                  defaultValue="text"
                  onChange={handleTypeChange}
                >
                  <Option value="text">
                    <span>
                      <UserOutlined className="mr-2" />
                      Text
                    </span>
                  </Option>
                  <Option value="number">
                    <span>
                      <NumberOutlined className="mr-2" />
                      Number
                    </span>
                  </Option>
                  <Option value="gps">
                    <span>
                      <EnvironmentOutlined className="mr-2" />
                      GPS
                    </span>
                  </Option>
                </Select>
              </Col>
              <Col span={3} align={"middle"}>
                <Checkbox onChange={handleRequiredChange}></Checkbox>
              </Col>
            </Row>
            
          </div>
        </div>
        <div className="flex">
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            className="mr-5"
            style={{ background: "white" }}
            onClick={showModal}
          >
            Add custom field
          </Button>
          <Button
            type="primary"
            ghost
            icon={<BarsOutlined />}
            style={{ background: "white" }}
          >
            Add section
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-1/3 bg-white p-3 h-screen">
        <h1 className="text-lg bold mb-4">Add existing fields</h1>
        <h4 className="text-[13px] text-[#828282] mb-7">
          Reuse existing fields that have been added to other types to keep your
          assets details consistent
        </h4>
        <Input
          placeholder="search"
          prefix={<SearchOutlined style={{ color: "#828282" }} />}
        />
        <div style={tableContainerStyle}>
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 1 }}>{record.description}</p>
              ),
            }}
            dataSource={data}
            showHeader={false}
          />
        </div>
      </div>
    </div>
  );
}
export default page;
