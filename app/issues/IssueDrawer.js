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
import { message, Space, Select, Form } from "antd";

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
  selectedRow.status === key;
};



const temp = [
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
];

const IssueDrawer = ({ open, onClose, selectedRow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(selectedRow);
  const [selectedPriority, setSelectedPriority] = useState(
    selectedRow.priority
  );
  let issue={};
  const uniqueId = self.crypto.randomUUID();
  const [form] = Form.useForm();
  form.setFieldsValue({ "Unique Id": uniqueId });

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    form.setFieldsValue({ priority: e.target.value });
  };
  const handleStatusChange = (e) => {
    form.setFieldValue({ status: e.target.value });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = () => {
    selectedRow = editedRow;
    toggleEditMode();
    onFinishEvent()
  };
 const onFinishEvent= (value)=>{
  let temp = {};
    for (let key in value) {
      if (key === "remarks") {
        issue.remarks = value[key];
      } else if (key === "description") {
        issue.description = value[key];
      }
      else if (key === "priority") {
        issue.priority = value[key];
      } 
      else if(key=== "status"){
        issue.status=value[key];
      }
      else {
        temp[`${key}`] = value[key];
      }
    }
    issue.reported_by = "employee@blunav.in";
    issue.reported_time = 1635249073607;
    issue.type="observation";
    issue.issue_id=selectedRow.issue_id;
    issue.asset = ["vishal"];
    issue.deadline = 1635249073607;
    issue.assigned_to = "jerry@blunav.in";
    issue.channel = "mobile";
    issue.location=[];
    issue.images = [];
    issue.issue_occurence_time=1635249073607;
    issue.docs = [];
    console.log(issue);
    console.log(JSON.stringify(issue));
    fetch(`https://digifield.onrender.com/issues/update-issue/${selectedRow.issue_id}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(issue),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledge) {
          success("Issue has been created");
        } else {
          warning(data.description);
        }
      });
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
          {isEditing ? (
            <Form form={form} onFinish={onFinishEvent}>
              <div>
                <div className="flex flex-row">
                  <div>
                    <Form.Item
                      name="remarks"
                      rules={[
                        {
                          required: true,
                          message: "Please type the asset name",
                        },
                      ]}
                    >
                      <div className="w-full h-full">
                        <input
                          type="text"
                          value={editedRow.remarks}
                          onChange={(e) => {
                            form.setFieldsValue({ remarks: e.target.value });
                          }}
                          className="w-full p-2 rounded-lg border border-gray-300"
                          placeholder="Remarks"
                        />
                        <textarea
                          value={editedRow.description}
                          onChange={(e) => {
                            form.setFieldsValue({
                              description: e.target.value,
                            });
                          }}
                          className="w-full p-2 mt-2 rounded-lg border border-gray-300 "
                          placeholder="Description"
                          rows="4"
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>
                <div className="pt-5 flex flex-row justify-between">
                  <p className="text-sm text-gray-500 mt-2">
                    {formattedDate} {formattedTime}
                  </p>

                  <MdLocationPin className="text-3xl font-bold fill-[#D00808]" />
                </div>

                <Divider />
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Please type the asset name",
                    },
                  ]}
                >
                  <div>
                    <Select
                      defaultValue={selectedPriority}
                      style={{ width: 120 }}
                      onChange={handlePriorityChange}
                      options={[
                        { value: "High", label: "High" },
                        { value: "Medium", label: "Medium" },
                        { value: "Low", label: "Low" },
                      ]}
                    />
                  </div>
                </Form.Item>
                <Divider />
                <div className="flex items-center">
                  <PiFolderOpenFill className="text-2xl fill-[#8596A0]" />
                  <p className="ml-2">Malfunctions</p>
                </div>
                <Divider />
                <div className="flex flex-row justify-between">
                  <Select
                    defaultValue={selectedRow.status}
                    style={{ width: 120 }}
                    onChange={handleStatusChange}
                    options={[
                      { value: "open", label: "open" },
                      { value: "closed", label: "closed" },
                    ]}
                  />
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
                      nextArrow={
                        <Button className="carousel-arrow">Next</Button>
                      }
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
            </Form>
          ) : (
            <div>
              <div className="flex flex-row">
                <div>
                  <div>
                    <h1 className="font-semibold text-xl">
                      {selectedRow.remarks}
                    </h1>
                    <p className="pt-2 pr-5">{selectedRow.description}</p>
                  </div>
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
              <Divider />
              <div className="flex items-center">
                <PiFolderOpenFill className="text-2xl fill-[#8596A0]" />
                <p className="ml-2">Malfunctions</p>
              </div>
              <Divider />
              <div className="flex flex-row justify-between">
                <Select
                  defaultValue={selectedRow.status}
                  style={{ width: 120 }}
                  options={[
                    { value: "open", label: "open" },
                    { value: "closed", label: "closed" },
                  ]}
                />
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
          )}
        </div>
        <div className="bg-[#E9EDF6] w-[55%] h-full overflow-y-auto">
          {/* <Chat /> */}
        </div>
      </div>
    </Drawer>
  );
};

export default IssueDrawer;
