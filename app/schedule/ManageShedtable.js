import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Button, Dropdown, Menu, Input, Space, message } from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { GoCheckbox } from "react-icons/go";
import { TfiGallery } from "react-icons/tfi";
import { BiBell } from "react-icons/bi";
import { BiMessageDetail } from "react-icons/bi";
import useSWR from "swr";
import { Island_Moments } from "next/font/google";
import LoadingIndicator from "../loadingIndicator";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";
import useMessage from "antd/es/message/useMessage";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ManageShedtable = ({ archived }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`https://digifield.onrender.com/schedule/get-all-schedules`, fetcher, {
    refreshInterval: 1000,
  });
  const [columData, setcolumData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    if (data != null) {
      const temp = data.map((item, index) => ({ ...item, key: index }));
      setcolumData(temp);
    }
  }, [data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? (Array.isArray(text) ? text.join(", ") : text) : ""}
        />
      ) : Array.isArray(text) ? (
        text.join(", ")
      ) : (
        text
      ),
  });
  
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Template",
      dataIndex: "template",
      key: "template",
      ...getColumnSearchProps("template"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        const reportedTime = new Date(text);
        const formattedDate = `${reportedTime.getMonth() + 1}/${reportedTime.getDate()}/${reportedTime.getFullYear()}`;
        const hours = reportedTime.getHours();
        const amPm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${String(reportedTime.getMinutes()).padStart(2, "0")}:${String(
          reportedTime.getSeconds()
        ).padStart(2, "0")} ${amPm}`;
        return `${formattedDate} ${formattedTime}`;
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Assigned to",
      dataIndex: "assignedTo",
      key: "assignedTo",
      ...getColumnSearchProps("assignedTo"),
    },
    {
      title: "Paused Status",
      dataIndex: "isPaused",
      key: "isPaused",
      filters: [
        {
          text: 'Active',
          value: false,
        },
        {
          text: 'Paused',
          value: true,
        },
      ],
      onFilter: (value, record) => record.isPaused === value,
      render: (condition) => {
        return condition ? "Paused" : "Active"
      }
    },
  ];

  if (isLoading) return <LoadingIndicator />;

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={columData}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/schedule/${record.title}`);
            },
          };
        }}
        rowClassName="hover: cursor-pointer"
        sticky
      />
    </div>
  );
};

export default ManageShedtable;
