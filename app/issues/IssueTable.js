import React, { useState, useEffect } from "react";
import { Divider, Table } from "antd";
import useSWR from "swr";
import Loading from "../loading";
import IssueDrawer from "./IssueDrawer";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import { FloatButton } from 'antd';
import { Modal } from 'antd';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const filterpriority = ["high", "medium", "low"];

const App = () => {
  const columns = [
    {
      title: "Priority",
      dataIndex: "priority",
      width: 140,
      filters: [
        {
          text: 'high',
          value: 'high',
        },
        {
          text: 'medium',
          value: 'medium',
        },
        {
          text: 'low',
          value: 'low',
        }
      ],
      onFilter: (value, record) => record.priority.startsWith(value),
    },
    {
      title: "Reported on",
      dataIndex: "reported_time",
      render: (text) => {
        const reportedTime = new Date(text);
        const formattedDate = `${reportedTime.getMonth() + 1}/${reportedTime.getDate()}/${reportedTime.getFullYear()}`;
        const hours = reportedTime.getHours();
        const amPm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${String(reportedTime.getMinutes()).padStart(2, '0')}:${String(reportedTime.getSeconds()).padStart(2, '0')} ${amPm}`;
        return `${formattedDate} ${formattedTime}`;
      },
      width: 120,
      sorter: (a, b) => a.reported_time - b.reported_time,
    },
    {
      title: "Reported By",
      dataIndex: "reported_by",
      width: 180,
    },
    {
      title: "Issue Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      filters: [
        {
          text: 'open',
          value: 'open',
        },
        {
          text: 'closed',
          value: 'closed',
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
    },
    {
      title: "Assigned to",
      dataIndex: "assigned_to",
      width: 180,
    },
  ];

  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
  const [selectionType] = useState("checkbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issues",
    fetcher,
    { refreshInterval: 1000 }
  );

  const filteredData = data
    ? data.filter((val) => {
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

  const showDownloadModal = () => {
    setIsDownloadModalVisible(true);
  };

  const handleDownload = () => {
    const excel = new Excel();
    excel
      .addSheet("Asset Data")
      .addColumns(filteredColumns.map((column) => ({ title: column.title, dataIndex: column.dataIndex }))
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

  return (
    <div>
      <Divider />
      <Table
        rowSelection={{
          type: selectionType,
        }}
        style={{ maxHeight: "100%" }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              openDrawer(record);
            },
          };
        }}
        columns={columns}
        dataSource={filteredData}
        onChange={onChange}
        size="small"
        sticky
      />
      <FloatButton
        type="primary"
        icon={<DownloadOutlined />}
        onClick={showDownloadModal}
      >
      </FloatButton>
      <Modal
        title="Download Confirmation"
        visible={isDownloadModalVisible}
        onOk={handleDownload}
        onCancel={handleCancelDownload}
      >
        <p>Do you want to download the Excel file of Asset Table?</p>
      </Modal>

      {selectedRow && (
        <IssueDrawer
          open={showDrawer}
          onClose={closeDrawer}
          selectedRow={selectedRow}
        />
      )}
    </div>
  );
};

export default App;
