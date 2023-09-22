import { React, useState, useEffect } from "react";
import { Table, Input, Button, Result, Select, Checkbox, Dropdown, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Loading from "../loading";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const AssetTable = () => {
  const router = useRouter();
  const [departmentFilter, setdepartmentFilter] = useState([]);
  const [typefilter, settypefilter] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(["asset_id", "asset_name", "department", "type"]);
  const [searchQuery, setsearchQuery] = useState("");
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 1000 }
  );


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

  let columns = [
    {
      title: "Asset name",
      dataIndex: "asset_name",
    },
    {
      title: "Asset Id",
      dataIndex: "asset_id",
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
  ]
  const [filteredColumns, setFilteredColumns] = useState(columns)

  useEffect(() => {
    let temp = columns.filter((col) => selectedColumn.includes(col.dataIndex));
    setFilteredColumns(temp)
  }, [selectedColumn])
  

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
      <div className="flex mb-3 w-full">
        <Input
          value={searchQuery}
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ color: "#828282", marginLeft: 10, marginRight:10, width: "300px" }}
          onChange={(e) => {
            setsearchQuery(e.target.value);
          }}
        />
        <Select
         mode="multiple"
          defaultValue={["asset_id", "asset_name", "department", "type"]}
          value={selectedColumn}
          maxTagCount={"responsive"}
          className="w-[300px]"
          onChange={(value) => setSelectedColumn(value)}
          
        > 
        
          <Select.Option value="asset_name">Asset Name</Select.Option>
          <Select.Option value="asset_id">Asset ID</Select.Option>
          <Select.Option value="department">Department</Select.Option>
          <Select.Option value="type">Type</Select.Option>
        </Select>

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
          columns={filteredColumns}
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
          size="small"
          sticky
          // scroll={{ y: 500}}
        />
      </div>
    </div>
  );
};
export default AssetTable;
