import { React, useState } from "react";
import { Input, Divider, Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function Details({ onDataUpdate , moveToTab}) {
  
  const [name, setname] = useState("")
  const [questions, setquestions] = useState([])


  return (
    <div className="w-[700px]">
      
        <div className="bg-white p-6 rounded-lg  ">
          <Form.Item
            name="name"
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
              <Input placeholder="Enter Category Name" onChange={(e) => {setname(e.target.value)}} />
            </div>
          </Form.Item>
        </div>

        <div className="bg-white p-6 mt-5 rounded-lg flex flex-col">
          <p className="font-base">Notifications</p>
          <p className="font-base">
            Automatically notify the following people when reporting
            "Observation"
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
          <p className="font-base">Follow-Up Questions</p>
          <p className="font-base">
            Automatically ask these questions when "Observation" is reported
          </p>
          <Divider />

          <div className="flex flex-row">
            <Form
              name="dynamic_form_nest_item"
              
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
                          <Input placeholder="Add your question" onChange={(e) => {
                      
                      const updatedQuestions = [...questions];
                      updatedQuestions[name] = e.target.value;
                      setquestions(updatedQuestions);
                    }}/>
                        </Form.Item>

                        <DeleteOutlined onClick={() => remove(name)} />
                       
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
        <Button type="primary" className="mr-5 w-[20%] mt-5 mb-10" onClick={()=>{
          onDataUpdate({name: name, questions: questions})
          moveToTab("2")

        }}>Save and Next</Button>
    
    </div>
  );
}

export default Details;
