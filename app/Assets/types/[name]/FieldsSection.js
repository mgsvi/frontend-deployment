import { React, useState, useEffect } from "react";
import {
  Input,
  Table,
  Row,
  Col,
  Spin,
  Space,
  Avatar,
  Button,
  Popconfirm,
  message,
  Result
} from "antd";
import useSWR from "swr";
import {
  EditOutlined,
  CheckOutlined,
  SearchOutlined,
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
} from "@ant-design/icons";

function FieldsSection(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-fields/",
    fetcher
  );
  const [query, setquery] = useState("");

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
      <div>
        {" "}
        <Spin indicator={antIcon} />{" "}
      </div>
    );

  function FieldType(val) {
    switch (val) {
      case "text":
        return (
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
            <h1 className="text-[#828282] ml-2  ">Text</h1>
          </div>
        );
      case "number":
        return (
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
            <h1 className="text-[#828282] ml-2  ">Number</h1>
          </div>
        );
      case "checkbox":
        return (
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
            <h1 className="text-[#828282] ml-2  ">Checkbox</h1>
          </div>
        );
      case "select":
        return (
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
            <h1 className="text-[#828282] ml-2 ">Select</h1>
          </div>
        );
      case "tags":
        return (
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
            <h1 className="text-[#828282] ml-2 ">Tags</h1>
          </div>
        );

      case "date":
        return (
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
            <h1 className="text-[#828282] ml-2  ">Date</h1>
          </div>
        );
      case "gps":
        return (
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
            <h1 className="text-[#828282] ml-2  ">GPS</h1>
          </div>
        );
      default:
        break;
    }
  }
  return (
    <div className="w-full h-full">
      {contextHolder}

      <h1 className="text-lg bold mb-4">Add existing fields</h1>
      <h4 className="text-[13px] text-[#828282] mb-7">
        Reuse existing fields that have been added to other types to keep your
        assets details consistent
      </h4>
      <Input
        value={query}
        onChange={(e) => setquery(e.target.value)}
        allowClear
        placeholder="search"
        prefix={<SearchOutlined style={{ color: "#828282" }} />}
      />
      <div className="w-full mt-5 overflow-y-auto bg-white">
        {data
          .filter((val) => {
            if (query == "") return true;
            else {
              return val.field_name.toLowerCase().includes(query) || val.type.toLowerCase().includes(query);
            }
          })
          .map((val, i) => {
            return (
              <Row
                align={"middle"}
                className={`border p-2 ${
                  i != data.length - 1 ? "border-b-0" : ""
                } `}
              >
                <Col span={9} align={"start"}>
                  <p className="text-[#828282]">{val.field_name}</p>
                </Col>
                <Col span={9}>
                  <p className="text-[#828282]">{FieldType(val.type)}</p>
                </Col>
                <Col span={3} align={"middle"}>
                  <Button type="text" onClick={()=>{
                    props.setassetType((old)=>{
                        let temp = {...old}
                        temp.fields[temp.fields.length-1].fields.push(val)
                        return temp
                    })
                  }}>
                    <PlusOutlined />
                  </Button>
                </Col>
                <Col span={3} align={"middle"}>
                  <Popconfirm
                    title="Delete the Field"
                    description="Performing this action will not remove the field from any asset types, are you sure?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                      fetch(
                        `https://digifield.onrender.com/assets/delete-fields/${val.field_name}`,
                        {
                          method: "DELETE",
                        }
                      )
                        .then((res) => res.json())
                        .then((res) => {
                          if (res.acknowledge) {
                            let temp = data.filter((item) => {
                              return item.field_name !== val.field_name;
                            });
                            mutate(temp);
                            success("Field has been deleted");
                          } else {
                            warning(res.description);
                          }
                        });
                    }}
                  >
                    <button className="text-[#828282] bg-transparent hover:text-black">
                      <EllipsisOutlined rotate={90} />
                    </button>
                  </Popconfirm>
                </Col>
              </Row>
            );
          })}
      </div>
    </div>
  );
}

export default FieldsSection;
