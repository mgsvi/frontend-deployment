import { React, useState, useEffect } from "react";
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
  EditOutlined,
  DownOutlined,
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
  Menu,
  Dropdown,
  Typography,
} from "antd";
import { BiSolidImageAdd, BiSolidMessageDetail } from "react-icons/bi";
import { TbChartDots3 } from "react-icons/tb";
import { MdOutlineAttachFile, MdLibraryAddCheck } from "react-icons/md";
import { FaSignature, FaImages, FaExternalLinkAlt } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BsFillBellFill } from "react-icons/bs";
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

function Create({ inspectionTemplate, setinspectionTemplate, templateName }) {
  const { Option } = Select;
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isNameEditEnabled, setisNameEditEnabled] = useState(false);
  const [textEditEnabled, settextEditEnabled] = useState(-1);
  const [numberEditEnabled, setnumberEditEnabled] = useState(-1);
  const [selectedOption, setSelectedOption] = useState("text");
  const [form] = Form.useForm();
  const { v4: uuidv4 } = require("uuid");
  const uniqueId = uuidv4();

  const objectsEqual = (o1, o2) =>
    typeof o1 === "object" && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      : o1 === o2;

  const arraysEqual = (a1, a2) => {
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
  };

  const setMultipleChoiceResponse = (newChoiceList) => {
    setinspectionTemplate({
      ...inspectionTemplate,
      multipleChoiceResponse: newChoiceList,
    });
  };

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
      {loading ? <LoadingOutlined /> : <BiSolidImageAdd size={50} color="#BFC6D4" className="flex items-center" />}
    </div>
  );

  const renderColumnsForOption = (question, pageIndex, sectionIndex, questionIndex) => {
    const addLogic = (newLogic) => {
      let temp = { ...inspectionTemplate };
      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic.push(newLogic);
      setinspectionTemplate(temp);
    };

    switch (question.responseType.type) {
      case "text":
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-start w-full divide-x-2  py-2 items-center gap-1 bg-[#F8F9FC] border-b-2">
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row items-center">
                  <Button
                    icon={<TbChartDots3 />}
                    type="link"
                    onClick={() => {
                      addLogic({
                        condition: "is",
                        value: "",
                        action: [],
                      });
                    }}
                  >
                    Add logic
                  </Button>
                </div>
              </Col>
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row items-center">
                  <Checkbox
                    checked={question.responseType.required}
                    className="mr-2"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                        e.target.checked;
                      setinspectionTemplate(temp);
                    }}
                  />
                  <h1>Required</h1>
                </div>
              </Col>
              <Col span={5} className="flex justify-center">
                <div className="flex flex-row items-center">
                  <h1 className="mr-2">Format: </h1>
                  <Dropdown
                    menu={{
                      items: [
                        { label: "Short Answer", key: "shortAnswer" },
                        { label: "Paragraph", key: "paragraph" },
                      ],
                      selectable: true,
                      defaultSelectedKeys: ["shortAnswer"],
                      selectedKeys: [
                        inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                          .format,
                      ],
                      onClick: (e) => {
                        let temp = { ...inspectionTemplate };
                        temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.format =
                          e.key;
                        setinspectionTemplate(temp);
                      },
                    }}
                    trigger={["click"]}
                  >
                    <Typography.Link>
                      {question.responseType.format == "shortAnswer" ? "Short Answer" : "Paragraph"}
                    </Typography.Link>
                  </Dropdown>
                </div>
              </Col>
              <Col span={4} className="justify-center">
                <Button type="link" icon={<MdOutlineAttachFile />}>
                  Add image
                </Button>
              </Col>
            </div>
            <div className="flex flex-col bg-[#E9EEF6] w-full pl-7 divide-y-2">
              {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                questionIndex
              ].responseType.logic.map((log, ind) => {
                return (
                  <div key={ind} className="flex flex-row bg-white w-full items-center p-3 justify-between">
                    <div className="flex items-center gap-1 w-full">
                      <p className="flex-none">If answer</p>
                      <Dropdown
                        className="flex-none"
                        menu={{
                          items: [
                            { label: "is", key: "is" },
                            { label: "is not", key: "isNot" },
                          ],
                          selectable: true,
                          selectedKeys: [
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].condition,
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].condition = e.key;
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>{log.condition == "is" ? " is " : " is not "}</Typography.Link>
                      </Dropdown>
                      {textEditEnabled == ind ? (
                        <Input
                          placeholder="value"
                          value={log.value}
                          bordered={false}
                          size="small"
                          className="w-[60px] max-w-[100px] flex-none"
                          onChange={(e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].value = e.target.value;
                            setinspectionTemplate(temp);
                          }}
                        />
                      ) : (
                        <p className="flex-none">
                          {log.value === "" || log.val === null ? <p className="underline">blank</p> : log.value}
                        </p>
                      )}
                      <Button
                        icon={textEditEnabled == ind ? <CheckOutlined /> : <EditOutlined />}
                        onClick={() =>
                          settextEditEnabled((old) => {
                            return old == -1 ? ind : -1;
                          })
                        }
                        type="text"
                      />
                      <p>then</p>
                      <div className="flex flex-row max-w-full gap-1 overflow-x-auto ">
                        {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                          questionIndex
                        ].responseType.logic[ind].action.map((trigger, index) => {
                          const deleteAction = () => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action = temp.pages[pageIndex].sections[sectionIndex].questions[
                              questionIndex
                            ].responseType.logic[ind].action.filter((val, i) => i != index);
                            setinspectionTemplate(temp);
                          };
                          switch (trigger) {
                            case "reportIssue":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#FFE5C6] ml-1 rounded-lg gap-2 items-center">
                                  <MdLibraryAddCheck />
                                  <p>report issue</p>{" "}
                                  <button className="bg-[#FFE5C6]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "requireEvidence":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6ffca] ml-1 rounded-lg gap-2 items-center">
                                  <FaImages />
                                  <p>require evidence</p>{" "}
                                  <button className="bg-[#c6ffca]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "notify":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6dcff] ml-1 rounded-lg gap-2 items-center">
                                  <BsFillBellFill />
                                  <p>notify</p>{" "}
                                  <button className="bg-[#c6dcff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "askQuestions":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#dac6ff] ml-1 rounded-lg gap-2 items-center">
                                  <BiSolidMessageDetail />
                                  <p>ask questions</p>{" "}
                                  <button className="bg-[#dac6ff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                          }
                        })}
                      </div>
                      <Dropdown
                        className="pl-1 flex-none"
                        menu={{
                          items: [
                            {
                              label: "Report Issue",
                              key: "reportIssue",
                              icon: <MdLibraryAddCheck />,
                            },
                            {
                              label: "Require Evidence",
                              key: "requireEvidence",
                              icon: <FaImages />,
                            },
                            {
                              label: "Notify",
                              key: "notify",
                              icon: <BsFillBellFill />,
                            },
                            {
                              label: "Ask Questions",
                              key: "askQuestions",
                              icon: <BiSolidMessageDetail />,
                            },
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action.push(e.key);
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>+trigger</Typography.Link>
                      </Dropdown>
                    </div>
                    <div className=" justify-end right-0">
                      <Button
                        type="text"
                        onClick={() => {
                          let temp = { ...inspectionTemplate };
                          temp.pages[pageIndex].sections[sectionIndex].questions[
                            questionIndex
                          ].responseType.logic.splice(questionIndex, 1);
                          setinspectionTemplate(temp);
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "number":
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-start w-full divide-x-2  py-2 items-center gap-1 bg-[#F8F9FC] border-b-2">
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row">
                  <Button
                    icon={<TbChartDots3 />}
                    type="link"
                    onClick={() => {
                      addLogic({
                        condition: "equalTo",
                        value: 0,
                        value2: 0,
                        action: [],
                      });
                    }}
                  >
                    Add logic
                  </Button>
                </div>
              </Col>
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row items-center">
                  <Checkbox
                    checked={question.responseType.required}
                    className="mr-2"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                        e.target.checked;
                      setinspectionTemplate(temp);
                    }}
                  />
                  <h1>Required</h1>
                </div>
              </Col>

              <Col span={4} className="flex justify-center">
                <Button type="link" icon={<MdOutlineAttachFile />}>
                  Add image
                </Button>
              </Col>
            </div>
            <div className="flex flex-col bg-[#E9EEF6] w-full pl-7 divide-y-2">
              {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                questionIndex
              ].responseType.logic.map((log, ind) => {
                return (
                  <div key={ind} className="flex flex-row bg-white w-full items-center p-3 justify-between">
                    <div className="flex items-center gap-1 w-full">
                      <p className="flex-none">If answer</p>
                      <Dropdown
                        className="flex-none"
                        menu={{
                          items: [
                            { label: "equal to", key: "equalTo" },
                            { label: "not equal to", key: "notEqualTo" },
                            { label: "less than", key: "lessThan" },
                            {
                              label: "less than or equal to",
                              key: "lessThanOrEqualTo",
                            },
                            { label: "greater than", key: "greaterThan" },
                            {
                              label: "greater than or equal to",
                              key: "greaterThanOrEqualTo",
                            },
                            { label: "between", key: "between" },
                            { label: "not between", key: "notBetween" },
                          ],
                          selectable: true,
                          selectedKeys: [
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].condition ?? "equalTo",
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].condition = e.key;
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>
                          {(() => {
                            switch (log.condition) {
                              case "equalTo":
                                return "equal to";
                              case "notEqualTo":
                                return "not equal to";
                              case "lessThan":
                                return "less than";
                              case "lessThanOrEqualTo":
                                return "less than or equal to";
                              case "greaterThan":
                                return "greater than";
                              case "greaterThanOrEqualTo":
                                return "greater than or equal to";
                              case "between":
                                return "between";
                              case "notBetween":
                                return "not between";
                            }
                          })()}
                        </Typography.Link>
                      </Dropdown>

                      {numberEditEnabled == ind ? (
                        <Input
                          type="number"
                          placeholder="Value"
                          value={log.value ?? 0}
                          bordered={false}
                          size="small"
                          className="w-[60px] max-w-[100px] flex-none"
                          onChange={(e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].value = e.target.value;
                            setinspectionTemplate(temp);
                          }}
                        />
                      ) : (
                        <p className="flex-none">{log.value ?? "nil"}</p>
                      )}
                      {(inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                        .logic[ind].condition == "between" ||
                        inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                          .logic[ind].condition == "notBetween") && (
                        <div className="flex flex-row flex-none items-center">
                          <p>and</p>
                          {numberEditEnabled == ind ? (
                            <Input
                              type="number"
                              placeholder="Value"
                              value={log.value2 ?? 0}
                              bordered={false}
                              size="small"
                              className="pl-1 w-[60px] max-w-[100px]"
                              onChange={(e) => {
                                let temp = { ...inspectionTemplate };
                                temp.pages[pageIndex].sections[sectionIndex].questions[
                                  questionIndex
                                ].responseType.logic[ind].value2 = e.target.value;
                                setinspectionTemplate(temp);
                              }}
                            />
                          ) : (
                            <p className="pl-1">{log.value2 ?? "nil"}</p>
                          )}
                        </div>
                      )}
                      <Button
                        icon={numberEditEnabled == ind ? <CheckOutlined /> : <EditOutlined />}
                        onClick={() =>
                          setnumberEditEnabled((old) => {
                            return old == -1 ? ind : -1;
                          })
                        }
                        type="text"
                      ></Button>
                      <p>then</p>
                      <div className="flex flex-row max-w-full gap-1 overflow-x-auto ">
                        {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                          questionIndex
                        ].responseType.logic[ind].action.map((trigger, index) => {
                          const deleteAction = () => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action = temp.pages[pageIndex].sections[sectionIndex].questions[
                              questionIndex
                            ].responseType.logic[ind].action.filter((val, i) => i != index);
                            setinspectionTemplate(temp);
                          };
                          switch (trigger) {
                            case "reportIssue":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#FFE5C6] ml-1 rounded-lg gap-2 items-center">
                                  <p>report issue</p>{" "}
                                  <button className="bg-[#FFE5C6]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "requireEvidence":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6ffca] ml-1 rounded-lg gap-2 items-center">
                                  <p>require evidence</p>{" "}
                                  <button className="bg-[#c6ffca]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "notify":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6dcff] ml-1 rounded-lg gap-2 items-center">
                                  <p>notify</p>{" "}
                                  <button className="bg-[#c6dcff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "askQuestions":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#dac6ff] ml-1 rounded-lg gap-2 items-center">
                                  <p>ask questions</p>{" "}
                                  <button className="bg-[#dac6ff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                          }
                        })}
                      </div>
                      <Dropdown
                        className="pl-1 flex-none"
                        menu={{
                          items: [
                            { label: "Report Issue", key: "reportIssue" },
                            {
                              label: "Require Evidence",
                              key: "requireEvidence",
                            },
                            { label: "Notify", key: "notify" },
                            { label: "Ask Questions", key: "askQuestions" },
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action.push(e.key);
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>+trigger</Typography.Link>
                      </Dropdown>
                    </div>
                    <div className=" justify-end right-0">
                      <Button
                        type="text"
                        onClick={() => {
                          let temp = { ...inspectionTemplate };
                          temp.pages[pageIndex].sections[sectionIndex].questions[
                            questionIndex
                          ].responseType.logic.splice(questionIndex, 1);
                          setinspectionTemplate(temp);
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-start w-full divide-x-2  py-2 items-center gap-1 bg-[#F8F9FC] border-b-2">
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row">
                  <Button
                    icon={<TbChartDots3 />}
                    type="link"
                    onClick={() => {
                      addLogic({
                        condition: "checked",
                        value: true,
                        action: [],
                      });
                    }}
                  >
                    Add logic
                  </Button>
                </div>
              </Col>
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row">
                  <Checkbox
                    checked={question.responseType.required}
                    className="mr-2"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                        e.target.checked;
                      setinspectionTemplate(temp);
                    }}
                  />
                  <h1>Required</h1>
                </div>
              </Col>

              <Col span={4} className="flex justify-center">
                <Button type="link" icon={<MdOutlineAttachFile />}>
                  Add image
                </Button>
              </Col>
            </div>
            <div className="flex flex-col bg-[#E9EEF6] w-full pl-7 divide-y-2">
              {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                questionIndex
              ].responseType.logic.map((log, ind) => {
                return (
                  <div key={ind} className="flex flex-row bg-white w-full items-center p-3 justify-between">
                    <div className="flex items-center w-full gap-1">
                      <p className="flex-none">If checkbox is</p>
                      <Dropdown
                        className="flex-none"
                        menu={{
                          items: [
                            { label: "checked ", key: "checked" },
                            { label: "not checked ", key: "notchecked" },
                          ],
                          selectable: true,
                          selectedKeys: [
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].condition,
                          ],
                          defaultSelectedKeys: ["Checked"],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].condition = e.key;
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].condition = e.key == "checked" ? true : false;
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>{log.condition == "checked" ? "checked" : "not checked"}</Typography.Link>
                      </Dropdown>

                      <p className="flex-none">then</p>
                      <div className="flex flex-row max-w-full gap-1 overflow-x-auto ">
                        {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                          questionIndex
                        ].responseType.logic[ind].action.map((trigger, index) => {
                          const deleteAction = () => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action = temp.pages[pageIndex].sections[sectionIndex].questions[
                              questionIndex
                            ].responseType.logic[ind].action.filter((val, i) => i != index);
                            setinspectionTemplate(temp);
                          };
                          switch (trigger) {
                            case "reportIssue":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#FFE5C6] ml-1 rounded-lg gap-2 items-center">
                                  <MdLibraryAddCheck />
                                  <p>report issue</p>{" "}
                                  <button className="bg-[#FFE5C6]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "requireEvidence":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6ffca] ml-1 rounded-lg gap-2 items-center">
                                  <FaImages />
                                  <p>require evidence</p>{" "}
                                  <button className="bg-[#c6ffca]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "notify":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6dcff] ml-1 rounded-lg gap-2 items-center">
                                  <BsFillBellFill />
                                  <p>notify</p>{" "}
                                  <button className="bg-[#c6dcff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "askQuestions":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#dac6ff] ml-1 rounded-lg gap-2 items-center">
                                  <BiSolidMessageDetail />
                                  <p>ask questions</p>{" "}
                                  <button className="bg-[#dac6ff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                          }
                        })}
                      </div>
                      <Dropdown
                        className="flex-none"
                        menu={{
                          items: [
                            {
                              label: "Report Issue",
                              key: "reportIssue",
                              icon: <MdLibraryAddCheck />,
                            },
                            {
                              label: "Require Evidence",
                              key: "requireEvidence",
                              icon: <FaImages />,
                            },
                            {
                              label: "Notify",
                              key: "notify",
                              icon: <BsFillBellFill />,
                            },
                            {
                              label: "Ask Questions",
                              key: "askQuestions",
                              icon: <BiSolidMessageDetail />,
                            },
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action.push(e.key);
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>+trigger</Typography.Link>
                      </Dropdown>
                    </div>
                    <div className=" justify-end right-0">
                      <Button
                        type="text"
                        onClick={() => {
                          let temp = { ...inspectionTemplate };
                          temp.pages[pageIndex].sections[sectionIndex].questions[
                            questionIndex
                          ].responseType.logic.splice(questionIndex, 1);
                          setinspectionTemplate(temp);
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "multiplechoice":
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-start w-full divide-x-2  py-2 items-center gap-1 bg-[#F8F9FC] border-b-2 overflow-x-clip">
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row">
                  <Button
                    icon={<TbChartDots3 />}
                    type="link"
                    onClick={() => {
                      addLogic({
                        condition: "is",
                        value: [],
                        action: [],
                      });
                    }}
                  >
                    Add logic
                  </Button>
                </div>
              </Col>
              <Col span={3} className="flex justify-center">
                <div className="flex flex-row">
                  <Checkbox
                    checked={question.responseType.required}
                    className="mr-2"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                        e.target.checked;
                      setinspectionTemplate(temp);
                    }}
                  />
                  <h1>Required</h1>
                </div>
              </Col>
              <Col span={5} className="flex justify-center">
                <div className="flex flex-row">
                  <Checkbox
                    checked={question.multipleSelection}
                    className="mr-2"
                    onChange={(e) => {
                      let temp = { ...inspectionTemplate };
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].multipleSelection =
                        e.target.checked;
                      setinspectionTemplate(temp);
                    }}
                  />
                  <h1>Multiple selection</h1>
                </div>
              </Col>
              <Col span={3} className="flex justify-center">
                <Button type="link" icon={<MdOutlineAttachFile />}>
                  Add image
                </Button>
              </Col>
              <Col span={9} className="flex justify-start items-center">
                <Dropdown
                  className="ml-2"
                  menu={{
                    items: inspectionTemplate.multipleChoiceResponse.map((val, i) => ({
                      key: i,
                      label: (
                        <div className="flex items-center w-full overflow-x-auto">
                          {val.map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              style={{
                                backgroundColor: item.color,
                                color: "#ffff",
                                fontSize: "8px",
                              }}
                              className="rounded-full mx-2 p-2 flex-none"
                            >
                              {item.optionName}
                            </span>
                          ))}
                        </div>
                      ),
                    })),
                    selectable: true,
                    selectedKeys:
                      inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                        .options != null
                        ? [
                            `${inspectionTemplate.multipleChoiceResponse.findIndex((x) =>
                              arraysEqual(
                                x,
                                inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                                  .responseType.options
                              )
                            )}`,
                          ]
                        : [],
                    onClick: (e) => {
                      let temp = { ...inspectionTemplate };
                      let log =
                        temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic;
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.options =
                        inspectionTemplate.multipleChoiceResponse[e.key];
                      temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic =
                        log.map((item) => ({ ...item, value: [] }));
                      setinspectionTemplate(temp);
                    },
                  }}
                  trigger={["click"]}
                >
                  <Typography.Link>
                    {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                      .options != undefined ? (
                      <div className="flex items-center w-full overflow-x-auto">
                        {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                          questionIndex
                        ].responseType.options.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            style={{
                              backgroundColor: item.color,
                              color: "#ffff",
                              fontSize: "8px",
                            }}
                            className="rounded-full mx-2 p-2 flex-none"
                          >
                            {item.optionName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "options"
                    )}
                  </Typography.Link>
                </Dropdown>
              </Col>
            </div>
            <div className="flex flex-col bg-[#E9EEF6] w-full pl-7 divide-y-2">
              {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                questionIndex
              ].responseType.logic.map((log, ind) => {
                return (
                  <div key={ind} className="flex flex-row bg-white w-full items-center p-3 justify-between">
                    <div className="flex items-center gap-1 w-full">
                      <p className="flex-none">If answer</p>
                      <Dropdown
                        className="flex-none"
                        menu={{
                          items: [
                            { label: "is", key: "is" },
                            { label: "is not", key: "isNot" },
                            { label: "is selected", key: "isSelected" },
                            {
                              label: "is not selected",
                              key: "isNotSelected",
                            },
                            { label: "is one of", key: "isOneOf" },
                            { label: "is none of", key: "isNoneOf" },
                          ],
                          selectable: true,
                          selectedKeys: [
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].condition,
                          ],
                          defaultSelectedKeys: ["is"],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].condition = e.key;
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>
                          {(() => {
                            switch (log.condition) {
                              case "is":
                                return "is";
                              case "isNot":
                                return "is not";
                              case "isSelected":
                                return "is selected";
                              case "isNotSelected":
                                return "is not selected";
                              case "isOneOf":
                                return "is one of";
                              case "isNoneOf":
                                return "is none of";
                            }
                          })()}
                        </Typography.Link>
                      </Dropdown>

                      <Dropdown
                        className="flex-none"
                        disabled={log.condition == "isSelected" || log.condition == "isNotSelected" ? true : false}
                        menu={{
                          items:
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.options != null
                              ? inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                                  questionIndex
                                ].responseType.options.map((val, i) => ({
                                  key: val.optionName,
                                  label: val.optionName,
                                }))
                              : [],
                          selectable: true,
                          multiple:
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].value == "isOneOf" ||
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].value == "isNoneOf"
                              ? true
                              : false,
                          selectedKeys:
                            inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                              .responseType.logic[ind].value.length != 0
                              ? inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[questionIndex]
                                  .responseType.logic[ind].value
                              : [],
                          onDeselect: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].value = temp.pages[pageIndex].sections[sectionIndex].questions[
                              questionIndex
                            ].responseType.logic[ind].value.filter((item) => item != e.key);
                            setinspectionTemplate(temp);
                          },
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            let cond =
                              temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                                ind
                              ].condition;
                            if (cond == "isOneOf" || cond == "isNoneOf") {
                              if (
                                !temp.pages[pageIndex].sections[sectionIndex].questions[
                                  questionIndex
                                ].responseType.logic[ind].value.includes(e.key)
                              ) {
                                temp.pages[pageIndex].sections[sectionIndex].questions[
                                  questionIndex
                                ].responseType.logic[ind].value = [
                                  ...temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType
                                    .logic[ind].value,
                                  e.key,
                                ];
                              }
                            }
                            if (cond == "is" || cond == "isNot") {
                              temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                                ind
                              ].value = [e.key];
                            }
                            if (cond == "isSelected" || cond == "isNotSelected") {
                              temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                                ind
                              ].value = [];
                            }
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link className="flex-none max-w-xs truncate">
                          {log.value.length != 0 ? log.value.join(", ") : "value"}
                        </Typography.Link>
                      </Dropdown>

                      <p>then</p>
                      <div className="flex flex-row gap-1 overflow-x-auto">
                        {inspectionTemplate.pages[pageIndex].sections[sectionIndex].questions[
                          questionIndex
                        ].responseType.logic[ind].action.map((trigger, index) => {
                          const deleteAction = () => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action = temp.pages[pageIndex].sections[sectionIndex].questions[
                              questionIndex
                            ].responseType.logic[ind].action.filter((val, i) => i != index);
                            setinspectionTemplate(temp);
                          };
                          switch (trigger) {
                            case "reportIssue":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#FFE5C6] rounded-lg gap-2 items-center">
                                  <p>report issue</p>{" "}
                                  <button className="bg-[#FFE5C6]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "requireEvidence":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6ffca] ml-1 rounded-lg gap-2 items-center">
                                  <p>require evidence</p>{" "}
                                  <button className="bg-[#c6ffca]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "notify":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#c6dcff] ml-1 rounded-lg gap-2 items-center">
                                  <p>notify</p>{" "}
                                  <button className="bg-[#c6dcff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                            case "askQuestions":
                              return (
                                <div className="flex flex-row flex-none px-2 bg-[#dac6ff] ml-1 rounded-lg gap-2 items-center">
                                  <p>ask questions</p>{" "}
                                  <button className="bg-[#dac6ff]" onClick={deleteAction}>
                                    x
                                  </button>
                                </div>
                              );
                          }
                        })}
                      </div>
                      <Dropdown
                        className="pl-1 flex-none"
                        menu={{
                          items: [
                            { label: "Report Issue", key: "reportIssue" },
                            {
                              label: "Require Evidence",
                              key: "requireEvidence",
                            },
                            { label: "Notify", key: "notify" },
                            { label: "Ask Questions", key: "askQuestions" },
                          ],
                          onClick: (e) => {
                            let temp = { ...inspectionTemplate };
                            temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.logic[
                              ind
                            ].action.push(e.key);
                            setinspectionTemplate(temp);
                          },
                        }}
                        trigger={["click"]}
                      >
                        <Typography.Link>+trigger</Typography.Link>
                      </Dropdown>
                    </div>
                    <div className=" justify-end right-0">
                      <Button
                        type="text"
                        onClick={() => {
                          let temp = { ...inspectionTemplate };
                          temp.pages[pageIndex].sections[sectionIndex].questions[
                            questionIndex
                          ].responseType.logic.splice(questionIndex, 1);
                          setinspectionTemplate(temp);
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "datetime":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2 items-center">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
            <Col span={3} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.date}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.date =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Date
              </Checkbox>
            </Col>
            <Col span={3} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.time}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.time =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Time
              </Checkbox>
            </Col>
          </div>
        );
      case "media":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );
      case "annotation":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );
      case "location":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );
      case "signature":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );
      case "instruction":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2 items-center">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
            <Col span={4} className="flex justify-center">
              <Button type="link" icon={<MdOutlineAttachFile />}>
                Add attachment
              </Button>
            </Col>
          </div>
        );
      case "site":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );
      case "asset":
        return (
          <div className="flex flex-row w-full divide-x-2  py-2">
            <Col span={4} className="flex w-full justify-around ">
              <Checkbox
                defaultChecked
                className="mr-2"
                checked={question.responseType.required}
                onChange={(e) => {
                  let temp = { ...inspectionTemplate };
                  temp.pages[pageIndex].sections[sectionIndex].questions[questionIndex].responseType.required =
                    e.target.checked;
                  setinspectionTemplate(temp);
                }}
              >
                Required
              </Checkbox>
            </Col>
          </div>
        );

      default:
        return <div></div>;
    }
  };

  const addQuestion = () => {
    const newTemplate = { ...inspectionTemplate };
    const lastPageIndex = newTemplate.pages.length - 1;
    if (newTemplate.pages[lastPageIndex].sections.length == 0) {
      addSection();
    }
    const lastSectionIndex = newTemplate.pages[lastPageIndex].sections.length - 1;
    newTemplate.pages[lastPageIndex].sections[lastSectionIndex].questions.push({
      questionTitle: "this is the question title",
      responseType: {
        type: "text",
        required: false,
        logic: [],
        format: "shortAnswer",
        image: null,
      },
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
    <div className="flex flex-row w-full h-full overflow-y-auto">
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
                <h1 className="text-2xl font-semi bold onClick">{inspectionTemplate.title}</h1>
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
              value={inspectionTemplate.description}
              onChange={(e) => {
                setinspectionTemplate({
                  ...inspectionTemplate,
                  description: e.target.value,
                });
              }}
              rows={1}
              placeholder="A brief description about the inspection template"
              maxLength={150}
              className="mt-3"
            />
          </div>
        </div>
        <div>
          {inspectionTemplate.pages.map((page, index) => {
            return (
              <div key={index} className="pt-5 ">
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
                    The Title Page is the first page of your inspection report. You can customize the Title Page above.
                  </h1>
                ) : (
                  <h1 className="ml-3 text-[#7E8A9C]">You can customize the Title Page above.</h1>
                )}
                {/* <EnterOutlined /> */}
                {page.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="ml-5 mt-2">
                    <div className="flex flex-row">
                      <Input
                        className="font-semi text-xl bold max-w-[300px]"
                        value={section.sectionName}
                        bordered={false}
                        placeholder="Click here to enter the section title"
                        onChange={(e) => {
                          let temp = { ...inspectionTemplate };
                          temp.pages[index].sections[sectionIndex].sectionName = e.target.value;
                          setinspectionTemplate(temp);
                        }}
                      />
                      <Button
                        type="text"
                        disabled={index === 0}
                        onClick={() => {
                          const newTemplate = { ...inspectionTemplate };
                          newTemplate.pages[index].sections.splice(sectionIndex, 1);
                          setinspectionTemplate(newTemplate);
                        }}
                      >
                        <DeleteOutlined style={{ fontSize: "18px" }} />
                      </Button>
                    </div>

                    {section.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className=" flex flex-row items-center mb-3">
                        <div className="w-[90%]">
                          <Row className="bg-white ">
                            <Col span={18} className=" border p-2">
                              <h1 className="text-[#7E8A9C] font-semibold">Question</h1>
                            </Col>
                            <Col span={6} className=" border p-2">
                              <h1 className="text-[#7E8A9C] text-base">Type of the response</h1>
                            </Col>
                          </Row>
                          <Row className="bg-white ">
                            <Col span={18} className=" border p-2">
                              <Input
                                bordered={false}
                                value={
                                  inspectionTemplate.pages[index].sections[sectionIndex].questions[questionIndex]
                                    .questionTitle
                                }
                                className="text-[14px] font-semi bold "
                                placeholder="* Type question"
                                onChange={(e) => {
                                  let copy = { ...inspectionTemplate };
                                  copy.pages[index].sections[sectionIndex].questions[questionIndex].questionTitle =
                                    e.target.value;
                                  setinspectionTemplate(copy);
                                }}
                              />
                            </Col>
                            <Col span={6} className=" border p-2">
                              <Select
                                value={
                                  inspectionTemplate.pages[index].sections[sectionIndex].questions[questionIndex]
                                    .responseType.type
                                }
                                defaultValue="text"
                                onChange={(e) => {
                                  let copy = { ...inspectionTemplate };
                                  let responseType = {};
                                  copy.pages[index].sections[sectionIndex].questions[questionIndex].responseType.type =
                                    e;
                                  switch (e) {
                                    case "text":
                                      responseType = {
                                        type: "text",
                                        required: true,
                                        logic: [],
                                        format: "shortAnswer",
                                        image: "",
                                      };
                                      break;
                                    case "number":
                                      responseType = {
                                        type: "number",
                                        required: true,
                                        logic: [],
                                        image: "",
                                      };
                                      break;
                                    case "checkbox":
                                      responseType = {
                                        type: "checkbox",
                                        required: true,
                                        logic: [],
                                        image: "",
                                      };
                                      break;
                                    case "multiplechoice":
                                      responseType = {
                                        type: "multiplechoice",
                                        multipleSelection: false,
                                        flaggedResponses: false,
                                        required: true,
                                        logic: [],
                                        options: null,
                                      };
                                      break;
                                    case "datetime":
                                      responseType = {
                                        type: "datetime",
                                        required: true,
                                        date: false,
                                        time: true,
                                      };
                                      break;
                                    case "media":
                                      responseType = {
                                        type: "media",
                                        required: true,
                                      };
                                      break;
                                    case "annotation":
                                      responseType = {
                                        type: "annotation",
                                        required: true,
                                      };
                                      break;
                                    case "signature":
                                      responseType = {
                                        type: "signature",
                                        required: true,
                                      };
                                      break;
                                    case "location":
                                      responseType = {
                                        type: "location",
                                        required: true,
                                      };
                                      break;
                                    case "instruction":
                                      responseType = {
                                        type: "instruction",
                                        url: "www.google.com",
                                        required: true,
                                      };
                                      break;
                                    case "site":
                                      responseType = {
                                        type: "site",
                                        required: true,
                                      };
                                      break;

                                    case "asset":
                                      responseType = {
                                        type: "site",
                                        required: true,
                                      };
                                      break;
                                  }
                                  copy.pages[index].sections[sectionIndex].questions[questionIndex].responseType =
                                    responseType;

                                  setinspectionTemplate(copy);
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
                                    <h1 className="text-[#828282] ml-2  ">Text</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Number</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Checkbox</h1>
                                  </div>
                                </Option>

                                {/* Multiplechoice dropdown */}
                                <Option value="multiplechoice">
                                  <div className="flex justify-start">
                                    <Space wrap>
                                      <Avatar
                                        size={21}
                                        style={{
                                          backgroundColor: "#ECF4FF",
                                          color: "#219653",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p className="text-sm">
                                          <CheckSquareOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">Multiple Choice</h1>
                                  </div>
                                </Option>

                                {/* date dropdown */}
                                <Option value="datetime">
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
                                    <h1 className="text-[#828282] ml-2  ">Date & Time</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Media</h1>
                                  </div>
                                </Option>

                                {/* Annotate dropdown */}
                                <Option value="annotation">
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
                                    <h1 className="text-[#828282] ml-2  ">Annotate</h1>
                                  </div>
                                </Option>

                                {/* Instructions dropdown */}
                                <Option value="instruction">
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
                                    <h1 className="text-[#828282] ml-2  ">Instructions</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Location</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Signature</h1>
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
                                    <h1 className="text-[#828282] ml-2  ">Site</h1>
                                  </div>
                                </Option>
                                {/* asset dropdown */}
                                <Option value="asset">
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
                                          <EditOutlined />
                                        </p>
                                      </Avatar>
                                    </Space>
                                    <h1 className="text-[#828282] ml-2  ">Asset</h1>
                                  </div>
                                </Option>
                              </Select>
                            </Col>
                          </Row>

                          <Row className="bg-white ">
                            {renderColumnsForOption(
                              page.sections[sectionIndex].questions[questionIndex],
                              index,
                              sectionIndex,
                              questionIndex
                            )}
                          </Row>
                        </div>
                        <div className="ml-2">
                          <Button
                            disabled={questionIndex == 0 && index == 0}
                            type="text"
                            onClick={() => {
                              const newTemplate = { ...inspectionTemplate };
                              newTemplate.pages[index].sections[sectionIndex].questions.splice(questionIndex, 1);
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
          <Button className="bg-white text-[#2F80ED] ml-10 border-[#CED3DE]" onClick={addQuestion}>
            + Add question
          </Button>

          <Button className="bg-white text-[#2F80ED] ml-2 border-[#CED3DE]" onClick={addPage}>
            + Add page
          </Button>
          <Button className="bg-white text-[#2F80ED] ml-2 border-[#CED3DE]" onClick={addSection}>
            + Add section
          </Button>
        </div>
      </div>
      <div className="flex flex-col  bg-[#F8F9FC] w-[35%]">
        <ResponseType
          MultipleChoiceResponse={inspectionTemplate.multipleChoiceResponse}
          setMultipleChoiceResponse={setMultipleChoiceResponse}
        />
      </div>
    </div>
  );
}

export default Create;
