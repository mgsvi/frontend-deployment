import { React, useState, useEffect } from "react";
import { Table, Input, Button, Result } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Loading from "../loading";
import Link from "next/link";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const AssetTable = () => {
  const router = useRouter();
  const [departmentFilter, setdepartmentFilter] = useState([]);
  const [typefilter, settypefilter] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 1000 }
  );

  const columns = [
    {
      title: "Asset name",
      dataIndex: "asset_name",
    },
    {
      title: "Asset Id",
      dataIndex: "asset_id",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Department",
      dataIndex: "department",
      filters: departmentFilter,
      onFilter: (value, record) => record.department.startsWith(value),
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: typefilter,
      onFilter: (value, record) => record.type.startsWith(value),
    },
  ];

  useEffect(() => {
    fetch("https://digifield.onrender.com/assets/get-all-assets")
      .then((res) => res.json())
      .then((assets) => {
        let departments = [];
        let types = [];
        for (let asset of assets) {
          if (!departments.includes(asset.department)) {
            departments.push(asset.department);
          }
          if (!types.includes(asset.type)) {
            types.push(asset.type);
          }
        }
        setdepartmentFilter(
          departments.map((val) => {
            return { text: val, value: val };
          })
        );
        settypefilter(
          types.map((val) => {
            return { text: val, value: val };
          })
        );
      });
  }, [data]);

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
        <Loading />{" "}
      </div>
    );

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 48px - 131px - 48px - 32px)" }}
    >
      <div className="flex mb-3 w-[300px]">
        <Input
          value={searchQuery}
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ color: "#828282" }}
          onChange={(e) => {
            setsearchQuery(e.target.value);
          }}
        />
      </div>

      <div
        className=""
        // style={{maxHeight: "", }}
      >
        <Table
          style={{ maxHeight: "100%" }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push(`/assets/${record.asset_id}`);
              }, // click row
            };
          }}
          columns={columns}
          dataSource={data.filter((val) => {
            return (
              searchQuery == "" ||
              val.asset_id.toLowerCase().includes(searchQuery) ||
              val.asset_name.toLowerCase().includes(searchQuery) ||
              val.department.toLowerCase().includes(searchQuery) ||
              val.type.toLowerCase().includes(searchQuery)
            );
          })}
          onChange={onChange}
          sticky
          // scroll={{ y: 500}}
        />
      </div>
    </div>
  );
};
export default AssetTable;
