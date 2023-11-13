import { React, useState, useEffect } from "react";
import { Button, Space, Avatar, Table, Modal, Drawer, Input, ColorPicker, Checkbox, Divider, message } from "antd";
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
  const defaultChoiceList = [
    { color: "#1677FF", flagged: true, optionName: "ad" },
    { color: "#1677FF", flagged: true, optionName: "adcf" },
    { color: "#1677FF", flagged: true, optionName: "fdv" },
    { color: "#1677FF", flagged: true, optionName: "wer" },
  ];

  const [MultipleChoice, setMultipleChoice] = useState(defaultChoiceList);
  const [MultipleChoiceIndex, setmMultipleChoiceIndex] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log(MultipleChoiceResponse);
  }, [MultipleChoiceResponse]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(MultipleChoice);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMultipleChoice(items);
  };

  console.log(MultipleChoiceResponse);

  const dataSource1 = MultipleChoiceResponse.map((row, rowIndex) => ({
    key: rowIndex,
    row,
  }));

  const columns1 = [
    {
      dataIndex: "row",
      key: "row",
      render: (row) => (
        <div className="flex items-center bg-white line-clamp-1 truncate text-black">
          {row.map((item, itemIndex) => (
            <span
              key={itemIndex}
              style={{
                backgroundColor: item.color,
                fontSize: "12px",
              }}
              className="rounded-full mx-2 p-2 text-white"
            >
              {item.optionName}
            </span>
          ))}
        </div>
      ),
      ellipsis: true,
    },
  ];
  const [open, setOpen] = useState(false);
  console.log(JSON.stringify(MultipleChoice));
  const [count, setcount] = useState(4);

  const [expand, setexpand] = useState([]);
  const addOption = () => {
    const newOption = {
      color: "#13855F",
      flagged: false,
      optionName: `Option ${count + 1}`,
    };
    setMultipleChoice((prev) => [...prev, newOption]);
    setcount(count + 1);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setmMultipleChoiceIndex(null);
    setMultipleChoice([...defaultChoiceList]);
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

  return (
    <div className="flex flex-col h-full">
      {contextHolder}
      <div className="flex flex-row justify-between h-fit mb-4">
        <p className="text-[#828282] text-xl font-semibold pt-1">Multiple choice responses</p>
        <Button type="link" onClick={showDrawer}>
          + Create responses
        </Button>
      </div>
      <p className="text-[#828282] h-fit pt-1">
        Edit and manage multiple choice responses. Once done, they can be added to multiple choice response type
        questions by selecting the options button
      </p>
      <div className="flex flex-col w-full items-start divide-y-2 text-sm mt-3 overflow-y-auto h-full">
        {MultipleChoiceResponse.map((row, index) => {
          return (
            <button
              className="flex flex-row w-full justify-start items-center flex-wrap bg-transparent hover:bg-[#dee1e8] rounded"
              onClick={() => {
                setmMultipleChoiceIndex(index);
                setMultipleChoice(MultipleChoiceResponse[index]);
                setOpen(true);
              }}
            >
              {row.map((item, itemIndex) => (
                <span
                  key={itemIndex}
                  style={{
                    backgroundColor: item.color,
                  }}
                  className="rounded-full m-2 px-2 py-1 text-white"
                >
                  {item.optionName}
                </span>
              ))}
            </button>
          );
        })}
        {/* <Table
          dataSource={dataSource1}
          columns={columns1}
          pagination={false}
          showHeader={false}
          bordered={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log(record);
                setmMultipleChoiceIndex(rowIndex);
                setMultipleChoice(MultipleChoiceResponse[rowIndex]);
                setOpen(true);
              },
            };
          }}
          rowClassName="hover: cursor-pointer"
          size="small"
        /> */}
      </div>
      {/* creating Multiple choice responses  */}
      <Drawer title="Multiple choice responses" placement="right" onClose={onClose} open={open} width={450}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {MultipleChoice.map((option, index) => (
                  <Draggable key={index} draggableId={String(index)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className="border">
                          <div
                            className="flex flex-row  p-2 items-center"
                            key={index}
                            onClick={() => toggleOptionExpansion(index)}
                          >
                            <div {...provided.dragHandleProps}>
                              <RiDraggable size={20} className="text-[#7E8A9C]" />
                            </div>
                            <Input
                              bordered={false}
                              className="text-[15px] font-semi bold text-[#4a4f56]"
                              placeholder={`option${index + 1}`}
                              value={MultipleChoice[index].optionName}
                              onChange={(e) => {
                                let temp = MultipleChoice.map((choice) => {
                                  return { ...choice };
                                });
                                temp[index].optionName = e.target.value;
                                setMultipleChoice(temp);
                              }}
                            />
                            <ColorPicker
                              presets={[
                                {
                                  label: "Recommended",
                                  colors: [
                                    "#000000",
                                    "#000000E0",
                                    "#000000A6",
                                    "#00000073",
                                    "#00000040",
                                    "#00000026",
                                    "#0000001A",
                                    "#00000012",
                                    "#0000000A",
                                    "#00000005",
                                    "#F5222D",
                                    "#FA8C16",
                                    "#FADB14",
                                    "#8BBB11",
                                    "#52C41A",
                                    "#13A8A8",
                                    "#1677FF",
                                    "#2F54EB",
                                    "#722ED1",
                                    "#EB2F96",
                                    "#F5222D4D",
                                    "#FA8C164D",
                                    "#FADB144D",
                                    "#8BBB114D",
                                    "#52C41A4D",
                                    "#13A8A84D",
                                    "#1677FF4D",
                                    "#2F54EB4D",
                                    "#722ED14D",
                                    "#EB2F964D",
                                  ],
                                },
                                {
                                  label: "Recent",
                                  colors: [],
                                },
                              ]}
                              defaultValue={option.color}
                              value={MultipleChoice[index].color}
                              onChange={(color) => {
                                setMultipleChoice((prev) => {
                                  const newOptions = [...prev];
                                  newOptions[index].color = color.toHexString();
                                  return newOptions;
                                });
                              }}
                            />
                          </div>
                          <div>
                            {expand.includes(index) ? (
                              <div className="flex flex-row justify-end items-center p-2">
                                <Checkbox
                                  checked={option.flagged}
                                  className="mr-2"
                                  onChange={(e) => {
                                    let temp = MultipleChoice.map((choice) => {
                                      return { ...choice };
                                    });
                                    temp[index].flagged = e.target.checked;
                                    setMultipleChoice(temp);
                                  }}
                                />
                                <h1 className="text-[15px] text-[#7E8A9C]">Mark as Flagged</h1>
                                <Divider type="vertical" className=" justify-center bg-[#7E8A9C]" />
                                <DeleteOutlined
                                  className="text-[#7E8A9C]"
                                  onClick={() => {
                                    const newTemplate = [...MultipleChoice];
                                    newTemplate.splice(index, 1);
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
        <div className="w-full flex justify-between mt-9">
          <div className="flex gap-3">
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              const validateOptions = () => {
                for (let choice of MultipleChoice) {
                  if (choice.optionName == "" || choice.optionName == null) {
                    return false;
                  }
                }
                return true;
              };
              if (MultipleChoiceIndex != null) {
                setMultipleChoice(MultipleChoiceResponse[MultipleChoiceIndex]);
                if (validateOptions()) {
                  const clone = MultipleChoice.map((option) => ({ ...option }));
                  const newChoicelist = MultipleChoiceResponse.map((val, i) => {
                    if (i == MultipleChoiceIndex) {
                      return clone;
                    } else {
                      return val;
                    }
                  });
                  setMultipleChoiceResponse(newChoicelist);
                } else {
                  messageApi.open({
                    type: "warning",
                    content: "Please provide option name for all the options",
                  });
                  return;
                }
              } else {
                if (validateOptions()) {
                  const clone = MultipleChoice.map((option) => ({ ...option }));
                  console.log(clone);
                  setMultipleChoiceResponse([...MultipleChoiceResponse, clone]);
                } else {
                  messageApi.open({
                    type: "warning",
                    content: "Please provide option name for all the options",
                  });
                  return;
                }
              }
              setmMultipleChoiceIndex(null);
              setMultipleChoice([...defaultChoiceList]);
              setcount(4);
              setOpen(false);
            }}
          >
            Save & Apply
          </Button>
          <Button
            type="primary"
            ghost
            style={{ background: "white" }}
            onClick={() => {
              setmMultipleChoiceIndex(null);
              setMultipleChoice([...defaultChoiceList]);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          </div>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            ghost
            style={{ background: "white" }}
            onClick={() => {
              setMultipleChoice([...defaultChoiceList]);
              const temp = MultipleChoiceResponse.filter((item, index)=> index != MultipleChoiceIndex)
              setmMultipleChoiceIndex(null);
              setMultipleChoiceResponse(temp)
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default ResponseType;
