import { React, useState } from "react";
import { Drawer, Divider, Carousel, Button, Image } from "antd";
import Chat from "./Chat";
import { EditOutlined } from "@ant-design/icons";
import { MdLocationPin } from "react-icons/md";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { PiFolderOpenFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
  selectedRow.status === key;
};

const items = [
  {
    label: "Open",
    key: "1",
  },
  {
    label: "Close",
    key: "2",
  },
];

const temp = [
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
];

const IssueDrawer = ({ open, onClose, selectedRow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(selectedRow);
  const [selectedPriority, setSelectedPriority] = useState(selectedRow.priority);

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (e, field) => {
    setEditedRow({
      ...editedRow,
      [field]: e.target.value,
    });
  };

  const handleUpdate = () => {
    // Perform the update logic here using the editedRow data
    // For example, you can make an API call to update the data
    // Once the update is successful, you can exit edit mode
    // and update the selectedRow with the edited data.

    // In this example, we're simply updating the selectedRow for demonstration purposes.
    selectedRow = editedRow;
    toggleEditMode();
  };

  const reportedTime = new Date(selectedRow.reported_time);
  const formattedDate = `${
    reportedTime.getMonth() + 1
  }/${reportedTime.getDate()}/${reportedTime.getFullYear()}`;
  let hours = reportedTime.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  if (hours > 12) {
    hours -= 12;
  }
  const formattedTime = `${hours}:${String(reportedTime.getMinutes()).padStart(
    2,
    "0"
  )}:${String(reportedTime.getSeconds()).padStart(2, "0")} ${amPm}`;

  return (
    <Drawer
      title={selectedRow.issue_id}
      visible={open}
      onClose={onClose}
      width="50%"
      placement="right"
      extra={
        <Space>
          {isEditing ? (
            <Button onClick={handleUpdate}>Update</Button>
          ) : (
            <Button onClick={toggleEditMode}>Edit</Button>
          )}
          <Button>
            <MdDeleteOutline />
          </Button>
        </Space>
      }
    >
      <div className="flex fixedflex-row h-screen overflow-hidden">
        <div className="flex flex-col bg-white overflow-y-auto w-[45%] pr-5">
          <div>
            <div className="flex flex-row">
              <div>
                {isEditing ? (
                  <div className="w-full h-full">
                    <input
                      type="text"
                      value={editedRow.remarks}
                      onChange={(e) => handleFieldChange(e, "remarks")}
                      className="w-full p-2 rounded-lg border border-gray-300"
                      placeholder="Remarks"
                    />
                    <textarea
                      value={editedRow.description}
                      onChange={(e) => handleFieldChange(e, "description")}
                      className="w-full p-2 mt-2 rounded-lg border border-gray-300 "
                      placeholder="Description"
                      rows="4"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="font-semibold text-xl">
                      {selectedRow.remarks}
                    </h1>
                    <p className="pt-2 pr-5">{selectedRow.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-5 flex flex-row justify-between">
              <p className="text-sm text-gray-500 mt-2">
                {formattedDate} {formattedTime}
              </p>

              <MdLocationPin className="text-3xl font-bold fill-[#D00808]" />
            </div>

            <Divider />
            {isEditing? (
              <div>
          <select
            value={selectedPriority}
            onChange={handlePriorityChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
            ):(
            <div className="flex items-center">
            <BsFillBookmarkFill
            className={`text-2xl ${
              selectedPriority === "high"
                ? "text-red-600"
                : selectedPriority === "medium"
                ? "text-orange-500"
                : selectedPriority === "low"
                ? "text-green-500"
                : ""
            }`}
          />
              <p className="ml-2">{selectedRow.priority}</p>
            </div>
            )}
            <Divider />
            <div className="flex items-center">
              <PiFolderOpenFill className="text-2xl fill-[#8596A0]" />
              <p className="ml-2">Malfunctions</p>
            </div>
            <Divider />
            <div className="flex flex-row justify-between">
              <Dropdown menu={{ items, onClick }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space className="border-2 border-[#DCE0E9] rounded-2xl px-5 py-1 text-lg">
                    {selectedRow.status}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-10 py-1 text-lg">
                Resolve
              </button>
            </div>

            <Divider />
            <div className="flex items-center">
              <BiSolidUser className="text-2xl fill-[#8596A0]" />
              <p className="ml-2">{selectedRow.assigned_to}</p>
            </div>
            <Divider />
            <div>
              <h1>Media,Links and docs</h1>
              <div className="bg-white rounded p-3 h-[200px] overflow-hidden">
                <Carousel
                  prevArrow={
                    <Button className="carousel-arrow">Previous</Button>
                  }
                  nextArrow={<Button className="carousel-arrow">Next</Button>}
                >
                  {temp.map((i, index) => {
                    return (
                      <div key={index}>
                        <Image width={100} src={i} />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </div>
            <Divider />
          </div>
        </div>
        <div className="bg-[#E9EDF6] w-[55%] h-full overflow-y-auto">
          {/* <Chat /> */}
        </div>
      </div>
    </Drawer>
  );
};

export default IssueDrawer;
