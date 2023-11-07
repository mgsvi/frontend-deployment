import { React, useState, useEffect } from "react";
import { Spin, Result, Table } from "antd";
import useSWR from "swr";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TypeTable({ searchQuery }) {
  const router = useRouter();
  const [createdByFilter, setcreatedByFilter] = useState([])
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 1000 }
  );
  
  useEffect(() => {
    if(data!=undefined) {
      let users = [];
      for (let type of data) {
        if (!users.includes(type.created_by)) {
          users.push(type.created_by);
        }
        console.log(users)
    }
    setcreatedByFilter(
      users.map((val) => {
        return { text: val, value: val };
      })
    );
  
  }
  }, [data])
  

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
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
      render: (text) => {
        const reportedTime = new Date(text);
        const formattedDate = `${reportedTime.getDate() + 1}/${reportedTime.getMonth()}/${reportedTime.getFullYear()}`;
        const hours = reportedTime.getHours();
        const amPm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${String(reportedTime.getMinutes()).padStart(2, '0')}:${String(reportedTime.getSeconds()).padStart(2, '0')} ${amPm}`;
        return `${formattedDate} ${formattedTime}`;
      },
      sorter: {
        compare: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        multiple: 1,
      },
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
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
      filters: createdByFilter,
      onFilter: (value, record) => {
        console.log(record.created_by, record.created_by == value)
        return record.created_by == value;
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
            val.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            val.created_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
            val.created_at.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })}
        onChange={onChange}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/assets/types/${record.name}`);
            },
          };
        }}
        rowClassName={"hover: cursor-pointer"}
      />
    </div>
  );
}
