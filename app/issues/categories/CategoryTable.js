import React, { useState, useEffect } from "react";
import { Divider, Table } from "antd";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const CategoryTable = ({ searchQuery }) => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issue-categories",
    fetcher,
    { refreshInterval: 1000 }
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Assigned By",
      dataIndex: "reportedBy",
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "accessibleTo",
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
  ];

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
          val.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          val.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          val.accessibleTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          val.assigned_to.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Table
        style={{ maxHeight: "100%" }}
        onRow={(record, rowIndex) => {
          return {
            style: {
              cursor: "pointer",
            },
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
