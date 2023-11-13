import { React, useState } from "react";
import { Input, Divider, Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Details({ moveToTab, setissueCategory, issueCategory }) {
  const router = useRouter();
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...issueCategory.questions];
    updatedQuestions[index] = value;

    setissueCategory((prevIssueCategory) => ({
      ...prevIssueCategory,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    setissueCategory((prevIssueCategory) => ({
      ...prevIssueCategory,
      questions: [...prevIssueCategory.questions, ""],
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...issueCategory.questions];
    updatedQuestions.splice(index, 1);

    setissueCategory((prevIssueCategory) => ({
      ...prevIssueCategory,
      questions: updatedQuestions,
    }));
  };

  return (
    <div className="w-[700px]">
      <div className="bg-white p-6 rounded-lg  ">
        <Form.Item
          name="Name"
          rules={[
            {
              required: true,
              message: "Please type the Category name",
            },
          ]}
        >
          <div>
            <h2 className="mb-2 text-[#333]  font-light">
              Category Name<span className="text-red-600">*</span>
            </h2>
            <Input
              value={issueCategory.name}
              onChange={(e) => {
                setissueCategory({ ...issueCategory, name: e.target.value });
              }}
            />
          </div>
        </Form.Item>
      </div>
      <div className="bg-white p-6 mt-5 rounded-lg flex flex-col">
        <p className="text-sm">Notifications</p>
        <p className="text-sm">
          Automatically notify the following people when reporting Observation
        </p>
        <Divider />
        <Button
          type="primary"
          ghost
          className="mr-5 w-[20%] mt-2"
          style={{ background: "white" }}
        >
          Edit Notifications
        </Button>
      </div>

      <div className="bg-white p-6 mt-5 rounded-lg flex flex-col">
        <p className="text-sm">Follow-Up Questions</p>
        <p className="text-sm">
          Automatically ask these questions when Observation is reported
        </p>
        <Divider />

        <div className="flex flex-col">
          {issueCategory.questions.map((question, index) => {
            return (
              <div className="flex flex-row w-1/2 mb-2" key={index}>
                <Input
                  value={issueCategory.questions[index]}
                  placeholder="Add your question"
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                />

                <DeleteOutlined
                  onClick={() => removeQuestion(index)}
                  className="ml-2 "
                />
              </div>
            );
          })}
          <div className="flex flex-row">
            <Button
              type="primary"
              ghost
              onClick={addQuestion}
              className="mr-5  mt-2"
              style={{ background: "white" }}
            >
              Add Questions
            </Button>
            <p className="mt-3">You can upload a maximum of 5 questions</p>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="mr-5 w-[20%] mt-5 mb-10"
        onClick={() => {
          moveToTab("2");
        }}
      >
        Save and Next
      </Button>
      <Button
        type="primary"
        ghost
        className="mr-5 w-[20%] mt-2"
        style={{ background: "white" }}
        onClick={() => router.push("/issues/categories")}
      >
        Cancel
      </Button>
    </div>
  );
}

export default Details;
