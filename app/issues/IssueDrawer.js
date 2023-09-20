import React from "react";
import { Drawer, Divider, Carousel, Button, Image } from "antd";
import Chat from "./Chat";
import { EditOutlined } from "@ant-design/icons";
import { MdLocationPin } from "react-icons/md";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { PiFolderOpenFill } from "react-icons/pi";
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
    >
      <div className="flex flex-row h-screen w-full">
        <div className="flex flex-col bg-white w-[45%] pr-5">
          <div>
            <div className="flex flex-row">
              <div>
                <h1 className="font-semibold text-xl">{selectedRow.remarks}</h1>
                <p className="pt-2 pr-5">{selectedRow.description}</p>
              </div>
              <div className="">
                <EditOutlined className="pl-5 text-2xl" />
              </div>
            </div>
            <div className="pt-5 flex flex-row justify-between">
              <p className="text-sm text-gray-500 mt-2">
                {formattedDate} {formattedTime}
              </p>

              <MdLocationPin className="text-3xl font-bold fill-[#D00808]" />
            </div>

            <Divider />
            <div className="flex items-center">
              {" "}
              <BsFillBookmarkFill
                className={`text-2xl ${
                  selectedRow.priority === "high"
                    ? "text-red-600"
                    : selectedRow.priority === "medium"
                    ? "text-orange-500"
                    : selectedRow.priority === "low"
                    ? "text-green-500"
                    : ""
                }`}
              />{" "}
              <p className="ml-2">{selectedRow.priority}</p>
            </div>
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
                  prevArrow={<Button className="carousel-arrow">Previous</Button>}
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
        <div className="bg-[#E9EDF6] w-[55%]">
          <h1>Chat will be displayed here</h1>
          {/* <Chat /> */}
        </div>
      </div>
    </Drawer>
  );
};

export default IssueDrawer;
