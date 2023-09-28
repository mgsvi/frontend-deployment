import React, { useState, useEffect } from "react";
import { Divider, Table } from "antd";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const columns = [
  {
    title: "Title",
    dataIndex: "name",
  },
  {
    title: "Assigned By",
    dataIndex: "reportedBy",
  },
  {
    title: "Assigned To",
    dataIndex: "accessibleTo",
  },
];

const CategoryTable = ({searchQuery}) => {
  
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issue-categories",
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    const transformedData = data
      ? data.map((item, index) => ({
          key: index,
          name: item.name || "-",
          reportedBy: item.access[0]?.reportedBy || "-",
          accessibleTo: item.access[0]?.accessibleTo[0] || "-",
          assigned_to: "-",
        }))
      : [];
    setDataSource(transformedData);
  }, [data]);

  const filteredData = dataSource
    ? dataSource.filter((val) => {
        return (
          searchQuery === "" ||
          val.name.toLowerCase().includes(searchQuery) ||
          val.reportedBy.toLowerCase().includes(searchQuery) ||
          val.accessibleTo.toLowerCase().includes(searchQuery) ||
          val.assigned_to.toLowerCase().includes(searchQuery)
        );
      })
    : [];

  const openDrawer = (record) => {
    setSelectedRow(record);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedRow(null);
  };

  return (
    <div>
      <Divider />
      <Table
        style={{ maxHeight: "100%" }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/issues/categories/${record.name}`);
            },
          };
        }}
        columns={columns}
        dataSource={filteredData}
        onChange={onChange}
        sticky
      />
    </div>
  );
};

export default CategoryTable;
