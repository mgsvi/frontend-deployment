import React from "react";
import { Input, Divider, Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const onFinish = (values) => {
  console.log("Received values of form:", values);
};

function Details() {
  return (
    <div className="w-[700px]">
      <div className="bg-white p-6 rounded-lg  ">
        <p className="mb-2 text-[#333]  font-semibold">
          {" "}
          Category Name <span className="text-red-600">*</span>
        </p>
        <Input placeholder="Enter category name" />
      </div>

      <div className="bg-white p-6 mt-5 rounded-lg flex flex-col">
        <p className="font-semibold">Notifications</p>
        <p className="font-semibold">
          Automatically notify the following people when reporting "Observation"
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
        <p className="font-semibold">Follow-Up Questions</p>
        <p className="font-semibold">
          Automatically ask these questions when "Observation" is reported
        </p>
        <Divider />

        <div className="flex flex-row">
          <Form
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
          >
            <Form.List name="users">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "first"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing question",
                          },
                        ]}
                      >
                        <Input placeholder="Add your question" />
                      </Form.Item>

                      <DeleteOutlined  onClick={() => remove(name)} />
                      <EditOutlined />
                    </Space>
                  ))}
                  <Form.Item>
                    <div className="flex flex-row">
                      <Button
                        type="primary"
                        ghost
                        onClick={() => add()}
                        className="mr-5  mt-2"
                        style={{ background: "white" }}
                      >
                        Add Questions
                      </Button>
                      <p className="mt-3">
                        
                        You can upload a maximum of 5 questions
                      </p>
                    </div>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Details;
