"use client"
import React, { useState, useEffect, useRef } from "react";
import { Divider, Table, Input, Space, Button, Result } from "antd";
import useSWR from "swr";
import IssueDrawer from "./IssueDrawer";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import Highlighter from "react-highlight-words";
import { Modal } from "antd";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
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
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
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
  });

  const columns = [
    {
      title: "Priority",
      dataIndex: "priority",
      width: 140,
      filters: [
        {
          text: "high",
          value: "high",
        },
        {
          text: "medium",
          value: "medium",
        },
        {
          text: "low",
          value: "low",
        },
      ],
      onFilter: (value, record) => record.priority.startsWith(value),
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
      title: "Reported on",
      dataIndex: "reported_time",
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
      width: 120,
      sorter: (a, b) => new Date(a.reported_time) - new Date(b.reported_time),
    },
    {
      title: "Reported By",
      dataIndex: "reported_by",
      width: 180,
      ...getColumnSearchProps("reported_by"),
    },
    {
      title: "Issue Description",
      dataIndex: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      filters: [
        {
          text: "open",
          value: "open",
        },
        {
          text: "closed",
          value: "closed",
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
    },
    {
      title: "Assigned to",
      dataIndex: "assigned_to",
      width: 180,
      ...getColumnSearchProps("assigned_to"),
    },
  ];

  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
  const [selectionType] = useState("checkbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const { data, error, isLoading } = useSWR("https://digifield.onrender.com/issues/get-all-issues", fetcher, {
    refreshInterval: 1000,
  });

  const openDrawer = (record) => {
    setSelectedRow(record);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedRow(null);
  };

  const showDownloadModal = () => {
    setIsDownloadModalVisible(true);
  };

  const handleDownload = () => {
    const excel = new Excel();
    excel
      .addSheet("Asset Data")
      .addColumns(
        data.map((column) => ({
          title: column.title,
          dataIndex: column.dataIndex,
        }))
      )
      // Replace 'your_data_here' with your actual data source
      .addDataSource(data)
      .saveAs("AssetData.xlsx");

    setIsDownloadModalVisible(false);
  };

  const handleCancelDownload = () => {
    setIsDownloadModalVisible(false);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // Handle table change here
    console.log("params", pagination, filters, sorter, extra);
  };

  if (error)
    return (
      <div>
        <Result status="warning" title="There are some problems with loading the fields." />
      </div>
    );
  if (isLoading) return <div>loading</div>;

  return (
    <div>
      <div className="flex w-full mb-3 justify-between">
        <Input
          value={searchQuery}
          placeholder="Search"
          allowClear
          prefix={<SearchOutlined />}
          style={{
            color: "#828282",
            marginRight: 10,
            width: "300px",
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        <Button type="primary" shape="round" icon={<DownloadOutlined />} onClick={showDownloadModal}></Button>
        <Modal
          title="Download Confirmation"
          visible={isDownloadModalVisible}
          onOk={handleDownload}
          onCancel={handleCancelDownload}
        >
          <p>Do you want to download the Excel file of Asset Table?</p>
        </Modal>
      </div>
      <Table
        style={{ maxHeight: "100%" }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              openDrawer(record);
            },
          };
        }}
        columns={columns}
        dataSource={data.filter((val) => {
          return (
            searchQuery === "" ||
            val.issue_id.toLowerCase().includes(searchQuery) ||
            val.priority.toLowerCase().includes(searchQuery) ||
            val.reported_time.toLowerCase().includes(searchQuery) ||
            val.reported_by.toLowerCase().includes(searchQuery) ||
            val.description.toLowerCase().includes(searchQuery) ||
            val.status.toLowerCase().includes(searchQuery) ||
            val.assigned_to.toLowerCase().includes(searchQuery)
          );
        })}
        onChange={onChange}
        size="small"
        sticky
        rowClassName={"hover: cursor-pointer"}
      />

      {selectedRow && <IssueDrawer open={showDrawer} onClose={closeDrawer} selectedRow={selectedRow} />}
    </div>
  );
};

export default App;
