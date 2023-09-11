import React from "react";
import { Drawer } from "antd";
import Chat from "./Chat";
const IssueDrawer = ({ open, onClose, selectedRow }) => {
  return (
    <Drawer
      title={selectedRow.issue_id}
      open={open}
      onClose={onClose}
      width="40%"
      placement="right"
    >
      <div className="flex flex-row h-screen">
        <div className="bg-white w-full p-4">
          <p>Priority: {selectedRow.priority}</p>
          <p>Reported on: {selectedRow.reported_time}</p>
          <p>Reported By: {selectedRow.reported_by}</p>
          <p>Issue Description: {selectedRow.description}</p>
          <p>Status: {selectedRow.status}</p>
          <p>Assigned to: {selectedRow.assigned_to}</p>
        </div>
        <div className="bg-[#E9EDF6] w-full flex-col p-4">
          <h1>Chat will be displayed here</h1>
          <Chat />
        </div>
      </div>
    </Drawer>
  );
};

export default IssueDrawer;
