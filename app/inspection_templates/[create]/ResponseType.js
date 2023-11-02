import { React, useState } from "react";
import {
  Button,
  Space,
  Avatar,
  Table,
  Modal,
  Drawer,
  Input,
  ColorPicker,
  Checkbox,
  Divider,
} from "antd";
import {
  NumberOutlined,
  TagsOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileImageOutlined,
  SlidersOutlined,
  HighlightOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaSignature } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDraggable } from "react-icons/ri";

function ResponseType({ MultipleChoiceResponse, setMultipleChoiceResponse }) {
  const [MultipleChoice, setMultipleChoice] = useState({
    options: [
      { color: "#FF0000", flagged: true, optionName: "Option 1" },
      { color: "#00FF00", flagged: true, optionName: "Option 2" },
      { color: "#0000FF", flagged: true, optionName: "Option 3" },
      { color: "#FFA500", flagged: true, optionName: "Option 4" },
    ],
  });
  
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(MultipleChoice.options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMultipleChoice({ options: items });
  };
  
  const dataSource1 = MultipleChoiceResponse.map((row, rowIndex) => ({
    key: rowIndex,
    row,
  }));

  const columns1 = [
    {
      dataIndex: "row",
      key: "row",
      render: (row) => (
        <div className="flex items-center bg-white">
          {row.map((item, itemIndex) => (
            <p
              key={itemIndex}
              style={{
                backgroundColor: item.color,
                color: "#ffff",
                fontSize: "12px",
              }}
              className="rounded-full mx-2 p-2"
            >
              {item.optionName}
            </p>
          ))}
        </div>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  console.log(MultipleChoice);
  const [count, setcount] = useState(4);

  const [expand, setexpand] = useState([]);
  const addOption = () => {
    const newOption = {
      color: "#13855F",
      flagged: false,
      optionName: `Option ${count + 1}`,
    };
    setMultipleChoice((prev) => ({
      options: [...prev.options, newOption],
    }));
    setcount(count + 1);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const toggleOptionExpansion = (index) => {
    if (expand.includes(index)) {
      setexpand(expand.filter((i) => i !== index));
    } else {
      setexpand([...expand, index]);
    }
  };
  const responseTypes = [
    "Text",
    "Number",
    "Checkbox",
    "Date",
    "Media",
    "Slider",
    "Annotate",
    "Location",
    "Signature",
    "Instructions",
    "Site",
  ];
  function getTypeIcon(val) {
    switch (val) {
      case "Text":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#fde3cf",
              color: "#f56a00",
              fontSize: "12px",
            }}
          >
            T
          </Avatar>
        );
      case "Number":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#fde3cf",
              color: "#f56a00",
              fontSize: "12px",
            }}
          >
            <NumberOutlined />
          </Avatar>
        );
      case "Checkbox":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#ECF4FF",
              color: "#2F80ED",
              fontSize: "12px",
            }}
          >
            <CheckSquareOutlined />
          </Avatar>
        );
      case "Date":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#D2FFE5",
              color: "#219653",
              fontSize: "12px",
            }}
          >
            <CalendarOutlined />
          </Avatar>
        );
      case "Media":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#EFDEFF",
              color: "#9B51E0",
              fontSize: "12px",
            }}
          >
            <FileImageOutlined />
          </Avatar>
        );
      case "Slider":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#fde3cf",
              color: "#f56a00",
              fontSize: "12px",
            }}
          >
            <SlidersOutlined />
          </Avatar>
        );
      case "Annotate":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#E4E4E4",
              color: "#4F4F4F",
              fontSize: "12px",
            }}
          >
            <HighlightOutlined />
          </Avatar>
        );
      case "Location":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#D2FFE5",
              color: "#219653",
              fontSize: "12px",
            }}
          >
            <EnvironmentOutlined />
          </Avatar>
        );
      case "Signature":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#E0F7FF",
              color: "#56CCF2",
              fontSize: "12px",
            }}
          >
            <FaSignature />
          </Avatar>
        );
      case "Instructions":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#EFDEFF",
              color: "#9B51E0",
              fontSize: "12px",
            }}
          >
            <MessageOutlined />
          </Avatar>
        );
      case "Site":
        return (
          <Avatar
            size={21}
            style={{
              backgroundColor: "#E0F7FF",
              color: "#56CCF2",
              fontSize: "12px",
            }}
          >
            <TagsOutlined />
          </Avatar>
        );
      default:
        return null;
    }
  }

  const columns = [
    {
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Space wrap className="ml-3">
          {getTypeIcon(text)}
          <span className="text-[#7E8A9C] ml-2 text-[15px]">{text}</span>
        </Space>
      ),
    },
  ];

  const dataSource = responseTypes.map((type) => ({
    type,
  }));

  return (
    <div className="flex flex-col">
      <div className="p-5">
        <h1 className="font-bold text-xl bold mb-2">Type of response</h1>
        <p className="text-[#828282]">
          Choose from response templates or create your own
        </p>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          pagination={false}
          className="bg-[#F8F9FC]"
        />
      </div>
      <div className="flex  flex-row p-5 justify-between">
        <p className="text-[#828282] font-semibold pt-1">
          Multiple choice responses
        </p>
        <Button type="link" onClick={showDrawer}>
          + Create responses
        </Button>
      </div>
      <div className="flex flex-col ">
        <Table
          dataSource={dataSource1}
          columns={columns1}
          pagination={false}
          showHeader={false}
          bordered={false}
          size="small"
        />
      </div>
      {/* creating Multiple choice responses  */}
      <Drawer
        title="Multiple choice responses"
        placement="right"
        onClose={onClose}
        open={open}
        width={450}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {MultipleChoice.options.map((option, index) => (
                  <Draggable
                    key={index}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="border">
                          <div
                            className="flex flex-row  p-2 items-center"
                            key={index}
                            onClick={() => toggleOptionExpansion(index)}
                          >
                            <div {...provided.dragHandleProps}>
                              <RiDraggable
                                size={20}
                                className="text-[#7E8A9C]"
                              />
                            </div>
                            <Input
                              bordered={false}
                              className="text-[15px] font-semi bold text-[#4a4f56]"
                              placeholder={option.optionName}
                              onChange={(e) => {
                                setMultipleChoice((prev) => {
                                  const newOptions = [...prev.options];
                                  newOptions[index].optionName = e.target.value;
                                  return { options: newOptions };
                                });
                              }}
                            />
                            <ColorPicker
                              onChange={(color) => {
                                setMultipleChoice((prev) => {
                                  const newOptions = [...prev.options];
                                  newOptions[index].color = color.toHexString();
                                  return { options: newOptions };
                                });
                              }}
                            />
                          </div>
                          <div>
                            {expand.includes(index) ? (
                              <div className="flex flex-row justify-end items-center p-2">
                                <Checkbox
                                  defaultChecked={option.flagged}
                                  className="mr-2"
                                  onChange={(e) => {
                                    setMultipleChoice((prev) => {
                                      const newOptions = [...prev.options];
                                      newOptions[index].flagged =
                                        e.target.checked;
                                      return { options: newOptions };
                                    });
                                  }}
                                />
                                <h1 className="text-[15px] text-[#7E8A9C]">
                                  Mark as Flagged
                                </h1>
                                <Divider
                                  type="vertical"
                                  className=" justify-center bg-[#7E8A9C]"
                                />
                                <DeleteOutlined
                                  className="text-[#7E8A9C]"
                                  onClick={() => {
                                    const newTemplate = { ...MultipleChoice };
                                    newTemplate.options.splice(index, 1);
                                    setMultipleChoice(newTemplate);
                                  }}
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div>
          <Button type="link" className="text-bold mt-1" onClick={addOption}>
            + Add response
          </Button>
        </div>
        <div className="w-full ">
          <Button
            type="primary"
            className="  mt-10 mb-10 mr-5"
            htmlType="submit"
            onClick={() => {
              setMultipleChoiceResponse([
                ...MultipleChoiceResponse,
                MultipleChoice.options,
              ]);
              console.log(JSON.stringify(MultipleChoiceResponse));
            }}
          >
            Save & Apply
          </Button>
          <Button
            type="primary"
            ghost
            className="mr-5 w-[20%] mt-5"
            style={{ background: "white" }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default ResponseType;
