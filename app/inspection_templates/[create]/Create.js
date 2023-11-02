import { React, useState } from "react";
import {
  LoadingOutlined,
  CheckOutlined,
  NumberOutlined,
  AppstoreOutlined,
  TagsOutlined,
  PartitionOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DeleteOutlined,
  FileImageOutlined,
  SlidersOutlined,
  HighlightOutlined,
  MessageOutlined,
  CloseOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import {
  message,
  Upload,
  Input,
  Form,
  Row,
  Col,
  Select,
  Space,
  Avatar,
  Button,
  Checkbox,
  Divider,
} from "antd";
import { BiSolidImageAdd } from "react-icons/bi";
import { TbChartDots3 } from "react-icons/tb";
import { MdOutlineAttachFile } from "react-icons/md";
import { FaSignature, FaImages, FaExternalLinkAlt } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdEdit } from "react-icons/md";
import ResponseType from "./ResponseType";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function Create({ inspectionTemplate, setinspectionTemplate }) {
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isNameEditEnabled, setisNameEditEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("text");
  const [form] = Form.useForm();
  const { v4: uuidv4 } = require("uuid");
  const uniqueId = uuidv4();
  const [MultipleChoiceResponse, setMultipleChoiceResponse] = useState([
   
  ]);

  form.setFieldsValue({ "Unique Id": uniqueId });
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <BiSolidImageAdd
          size={50}
          color="#BFC6D4"
          className="flex items-center"
        />
      )}
    </div>
  );

  const renderColumnsForOption = (option) => {
    switch (option) {
      case "text":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <TbChartDots3 size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Add logic</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="mr-2">Format: </h1>
                <h1 className="text-[#2F80ED] underline-offset-1">
                  {" "}
                  Short answer
                </h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <MdOutlineAttachFile
                  size={18}
                  className="text-[#2F80ED] mr-2"
                />
                <h1 className="text-[#2F80ED]">Add image</h1>
              </div>
            </Col>
          </div>
        );
      case "number":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <TbChartDots3 size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Add logic</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="mr-2">Format: </h1>
                <h1 className="text-[#2F80ED] underline-offset-1"> Number</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <MdOutlineAttachFile
                  size={18}
                  className="text-[#2F80ED] mr-2"
                />
                <h1 className="text-[#2F80ED]">Add image</h1>
              </div>
            </Col>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <TbChartDots3 size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Add logic</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>

            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <MdOutlineAttachFile
                  size={18}
                  className="text-[#2F80ED] mr-2"
                />
                <h1 className="text-[#2F80ED]">Add image</h1>
              </div>
            </Col>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Date</h1>
              </div>
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Time</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <MdOutlineAttachFile
                  size={18}
                  className="text-[#2F80ED] mr-2"
                />
                <h1 className="text-[#2F80ED]">Add image</h1>
              </div>
            </Col>
          </div>
        );

      case "media":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
          </div>
        );
      case "slider":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <TbChartDots3 size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Add logic</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="text-[#2F80ED] underline-offset-1">
                  {" "}
                  Range: 1 - 10
                </h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <MdOutlineAttachFile
                  size={18}
                  className="text-[#2F80ED] mr-2"
                />
                <h1 className="text-[#2F80ED]">Add image</h1>
              </div>
            </Col>
          </div>
        );
      case "annotate":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={8} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="text-[#2F80ED] underline-offset-1">
                  {" "}
                  Upload image to annotate
                </h1>
              </div>
            </Col>
          </div>
        );
      case "location":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
          </div>
        );

      case "signature":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <TbChartDots3 size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Add logic</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
          </div>
        );
      case "instructions":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={8} className="flex justify-around">
              <div className="flex flex-row">
                <FaImages size={18} className="text-[#2F80ED] mr-2" />
                <h1 className="text-[#2F80ED]">Upload Attachment</h1>
              </div>
            </Col>
            <Col span={10} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="mr-2 text-[#7E8A9C]">
                  One image or PDF can be uploaded{" "}
                </h1>
              </div>
            </Col>
          </div>
        );
      case "site":
        return (
          <div className="flex flex-row w-[60%] divide-x-2  py-2">
            <Col span={6} className="flex justify-around ">
              <div className="flex flex-row">
                <Checkbox defaultChecked className="mr-2" />
                <h1>Required</h1>
              </div>
            </Col>
            <Col span={6} className="flex justify-around">
              <div className="flex flex-row">
                <h1 className="text-[#2F80ED]">Manage site</h1>
              </div>
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  const addQuestion = () => {
    const newTemplate = { ...inspectionTemplate };
    const lastPageIndex = newTemplate.pages.length - 1;
    const lastSectionIndex =
      newTemplate.pages[lastPageIndex].sections.length - 1;
    newTemplate.pages[lastPageIndex].sections[lastSectionIndex].questions.push({
      orderNo:
        newTemplate.pages[lastPageIndex].sections[lastSectionIndex].questions
          .length + 1,
      questionTitle: "New Question",
      responseType: { type: "text" },
      required: true,
    });
    setinspectionTemplate(newTemplate);
  };

  const addSection = () => {
    const newTemplate = { ...inspectionTemplate };
    const lastPageIndex = newTemplate.pages.length - 1;
    newTemplate.pages[lastPageIndex].sections.push({
      sectionName: "New Section",
      questions: [],
    });
    setinspectionTemplate(newTemplate);
  };

  const addPage = () => {
    const newTemplate = { ...inspectionTemplate };
    newTemplate.pages.push({
      pageTitle: "New Page",
      sections: [
        {
          sectionName: "New Section",
          questions: [],
        },
      ],
    });
    setinspectionTemplate(newTemplate);
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full mt-10">
        <div className="flex flex-row">
          <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div className="flex flex-col justify-center pl-10 w-[50%]">
            {isNameEditEnabled ? (
              <div className="flex gap-2">
                <Input
                  className="text-2xl font-semi bold "
                  value={inspectionTemplate.title}
                  onChange={(e) => {
                    setinspectionTemplate({
                      ...inspectionTemplate,
                      title: e.target.value,
                    });
                    form.setFieldsValue({ templateName: e.target.value });
                  }}
                />
                <button
                  onClick={() => {
                    setisNameEditEnabled(!isNameEditEnabled);
                  }}
                  style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                >
                  <CheckOutlined />
                </button>
              </div>
            ) : (
              <div className="flex">
                <h1 className="text-2xl font-semi bold onClick">
                  {inspectionTemplate.title}
                </h1>
                <button
                  onClick={() => {
                    setisNameEditEnabled(!isNameEditEnabled);
                  }}
                  style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                >
                  <MdEdit size={20} color="#7E8A9C" />
                </button>
              </div>
            )}

            <TextArea
              rows={1}
              placeholder="A brief description about the inspection template"
              maxLength={150}
              className = "mt-3"
            />
          </div>
        </div>
        <div>
          {inspectionTemplate.pages.map((page, index) => {
            return (
              <div className="pt-5 ">
                <div className="flex flex-row ">
                  <Input
                    className="font-semi text-xl bold max-w-[300px]"
                    value={page.pageTitle}
                    bordered={false}
                    placeholder="Click here to enter the page title"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[index].pageTitle = e.target.value;
                      setinspectionTemplate(temp);
                      form.setFieldsValue({ templateName: e.target.value });
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="text"
                      disabled={index == 0}
                      onClick={() => {
                        const newTemplate = { ...inspectionTemplate };
                        newTemplate.pages.splice(index, 1);
                        setinspectionTemplate(newTemplate);
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "18px" }} />
                    </Button>
                  </div>
                </div>
                {index == 0 ? (
                  <h1 className="ml-3 text-[#7E8A9C]">
                    The Title Page is the first page of your inspection report.
                    You can customize the Title Page above.
                  </h1>
                ) : (
                  <h1 className="ml-3 text-[#7E8A9C]">
                    You can customize the Title Page above.
                  </h1>
                )}
                {/* <EnterOutlined /> */}
                {page.sections.map((section, sectionIndex) => (
                  <div>
                    {section.questions.map((question, questionIndex) => (
                      <div className=" flex flex-row items-center">
                        <div className="w-[90%]">
                          <Row className="bg-white  mt-5 ">
                            <Col span={18} className=" border p-2">
                              <h1 className="text-[#7E8A9C] font-semibold">
                                Question
                              </h1>
                            </Col>
                            <Col span={6} className=" border p-2">
                              <h1 className="text-[#7E8A9C] text-base">
                                Type of the response
                              </h1>
                            </Col>
                          </Row>
                          <Row className="bg-white ">
                            <Col span={18} className=" border p-2">
                              <Input
                                bordered={false}
                                className="text-[14px] font-semi bold "
                                placeholder="* Type question"
                                onChange={(e) => {
                                  setinspectionTemplate({
                                    ...inspectionTemplate,
                                    question: e.target.value,
                                  });
                                }}
                              />
                            </Col>
                            <Col span={6} className=" border p-2">
                              <Select
                                defaultValue="text"
                                onChange={(e) => {
                                  let copy = { ...inspectionTemplate };
                                  copy.pages[index].sections[
                                    sectionIndex
                                  ].questions[questionIndex].responseType.type =
                                    e;
                                  setinspectionTemplate({
                                    ...inspectionTemplate,
                                    copy,
                                  });
                                }}
                                bordered={false}
                                className="w-full"
                              >
                                {/* text dropdown */}
                                <Option value="text">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#fde3cf",
                                          color: "#f56a00",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">T</p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Text
                                    </h1>
                                  </div>
                                </Option>

                                {/* number dropdown */}
                                <Option value="number">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#fde3cf",
                                          color: "#f56a00",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <NumberOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Number
                                    </h1>
                                  </div>
                                </Option>

                                {/* checkbox dropdown */}
                                <Option value="checkbox">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#ECF4FF",
                                          color: "#2F80ED",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <CheckSquareOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Checkbox
                                    </h1>
                                  </div>
                                </Option>
                                {/* date dropdown */}
                                <Option value="date">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#D2FFE5",
                                          color: "#219653",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <CalendarOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Date & Time
                                    </h1>
                                  </div>
                                </Option>
                                {/* Media dropdown */}
                                <Option value="media">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#EFDEFF",
                                          color: "#9B51E0",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <FileImageOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Media
                                    </h1>
                                  </div>
                                </Option>
                                {/* slider dropdown */}
                                <Option value="slider">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#fde3cf",
                                          color: "#f56a00",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <SlidersOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Slider
                                    </h1>
                                  </div>
                                </Option>
                                {/* Annotate dropdown */}
                                <Option value="annotate">
                                  <div className="flex justify-start ">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#E4E4E4",
                                          color: "#4F4F4F",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <HighlightOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Annotate
                                    </h1>
                                  </div>
                                </Option>

                                {/* Instructions dropdown */}
                                <Option value="instructions">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#EFDEFF",
                                          color: "#9B51E0",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <MessageOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Instructions
                                    </h1>
                                  </div>
                                </Option>
                                {/* Location dropdown */}
                                <Option value="location">
                                  <div className="flex justify-start ">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#D2FFE5",
                                          color: "#219653",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <EnvironmentOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Location
                                    </h1>
                                  </div>
                                </Option>
                                {/* signature dropdown */}
                                <Option value="signature">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#E0F7FF",
                                          color: "#56CCF2",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <FaSignature />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Signature
                                    </h1>
                                  </div>
                                </Option>
                                {/* site dropdown */}
                                <Option value="site">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#E0F7FF",
                                          color: "#56CCF2",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <TagsOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">
                                      Site
                                    </h1>
                                  </div>
                                </Option>
                              </Select>
                            </Col>
                          </Row>

                          <Row className="bg-white ">
                            {renderColumnsForOption(
                              page.sections[sectionIndex].questions[
                                questionIndex
                              ].responseType.type
                            )}
                          </Row>
                        </div>
                        <div className="ml-2">
                          <Button
                            disabled={questionIndex == 0 && index == 0}
                            type="text"
                            onClick={() => {
                              const newTemplate = { ...inspectionTemplate };
                              newTemplate.pages[index].sections[
                                sectionIndex
                              ].questions.splice(questionIndex, 1);
                              setinspectionTemplate(newTemplate);
                            }}
                          >
                            <CloseOutlined />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="flex flex-row mt-5  w-1/4 mb-10">
          <Button
            className="bg-white text-[#2F80ED] ml-10 border-[#CED3DE]"
            onClick={addQuestion}
          >
            + Add question
          </Button>

          <Button
            className="bg-white text-[#2F80ED] ml-2 border-[#CED3DE]"
            onClick={addPage}
          >
            + Add page
          </Button>
          <Button
            className="bg-white text-[#2F80ED] ml-2 border-[#CED3DE]"
            onClick={addSection}
          >
            + Add section
          </Button>
        </div>
      </div>
      <div className="flex flex-col  bg-[#F8F9FC] w-[35%]">
        <ResponseType
          MultipleChoiceResponse={MultipleChoiceResponse}
          setMultipleChoiceResponse={setMultipleChoiceResponse}
        />
      </div>
    </div>
  );
}

export default Create;
