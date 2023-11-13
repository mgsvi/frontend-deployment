"use client"
import { React, useState } from "react";
import { Button, Input, Modal, Tabs } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import Templatetable from "./Templatetable";
import { useRouter } from "next/navigation";

function Template() {
  const [modal2Open, setModal2Open] = useState(false);
  const [templateName, settemplateName] = useState("")
  const router = useRouter()
  const onChange = (key) => {
    console.log(key);
  };



  const items = [
    {
      key: '1',
      label: 'Templates',
      children: (<div>
        <Templatetable />
      </div>),
    },
    {
      key: '2',
      label: 'Archive',
      children: 'Content of Tab Pane 2',
    },
  ];
  return (
    <div className="flex flex-col p-10 h-full w-full">
      <div>
        <h1 className="text-xl font-semi bold mb-5">Templates</h1>
      </div>
      <div className=" flex flex-row justify-between mb-4">
          <div className="flex">
            <Input
              // value={searchQuery}
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{ color: "#828282" }}
              // onChange={(e) => {
              //   setsearchQuery(e.target.value);
              // }}
            />
          </div>
    
          <Button type="primary" onClick={() => setModal2Open(true)}>
            create Template
          </Button>

          {/* popup */}
          <Modal
            title="Create new template"
            centered
            open={modal2Open}
            onOk={() => {
              if(templateName != "") {
                setModal2Open(false);
              router.push(`/inspection_templates/${templateName}`);
              } else {
                messageApi.open({
                  type: "warning",
                  content: "template name cannot be empty",
                });
              }
            }}
            onCancel={() => setModal2Open(false)}
          >
            <p className="mt-3">Name of the template</p>
            <Input
              placeholder=""
              value={templateName}
              onChange={(e) => {
                settemplateName(e.target.value);
              }}
            />
          </Modal>
        </div>
        <div className="w-full h-full">
          <Tabs
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            items={items}
            onChange={onChange}
          />
        </div>
    </div>
  );
}

export default Template;
