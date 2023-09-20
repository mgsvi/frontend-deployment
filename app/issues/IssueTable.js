import React, { useState } from "react";
import { Divider, Table } from "antd";
import useSWR from "swr";
import Loading from "../loading";
import IssueDrawer from "./IssueDrawer";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const columns = [
  {
    title: "Priority",
    dataIndex: "priority",
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
  },
  {
    title: "Reported By",
    dataIndex: "reported_by",
  },
  {
    title: "Issue Description",
    dataIndex: "description",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Assigned to",
    dataIndex: "assigned_to",
  },
];

const App = () => {
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
        sticky
      />

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
