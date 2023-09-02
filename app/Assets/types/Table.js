import { React, useState, useEffect } from "react";
import { Spin, Result, Table } from "antd";
import useSWR from "swr";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TypeTable({ searchQuery }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 1000 }
  );

 
 

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
      filters: [],
      onFilter: (value, record) => {
        record.created_by == value;
      },
      width: "30%",
    },
  ];
  const onChange = (filters, sorter) => {
    console.log("params", filters, sorter);
  };
  if (error)
    return (
      <div>
        <Result
          status="warning"
          title="There are some problems with Loading the Table."
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

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.filter((val) => {
          return (
            searchQuery == "" ||
            val.name.toLowerCase().includes(searchQuery) ||
            val.created_by.toLowerCase().includes(searchQuery) ||
            val.created_at.toLowerCase().includes(searchQuery)
          );
        })}
        onChange={onChange}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/assets/types/${record.name}`);
            }, // click row
          };
        }}
      />
    </div>
  );
}
