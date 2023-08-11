import React from "react";
import { Spin, Result, Table } from "antd";
import useSWR from "swr";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TypeTable() {
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 1000 }
  );
  let filters = [];
  console.log(data);
  if (data != [] && !isLoading && data != null) {
    filters = data.map((val, i) => {
      let temp = { text: val.created_by, val: val.created_by };
      return temp;
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Link href={`/assets/types/${text}`}>{text}</Link>,
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
      filters: filters,
      onFilter: (value, record) => {
        record.created_by == value;
        console.log(record, value, record.created_by);
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
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
}
