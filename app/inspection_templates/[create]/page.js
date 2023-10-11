"use client";

import { React, useState } from "react";
import { Button, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Create from "./Create";

function createTemplate({ params }) {
  console.log(params.create);
  const [inspectionTemplate, setinspectionTemplate] = useState({
    title: params.create,
    description: "This is a sample description",
    image: null,
    assets: [],
    enforeAssetZone: false,
    createdAt: null,
    access: [],
    pages: [
      {
        pageTitle: "Page 1",
        sections: [
          {
            sectionName: "Primary",
            questions: [
              {
                orderNo: 1,
                questionTitle: "this is the question title",
                responseType: {
                  type: "text",
                },
                required: true,
              },
            ],
          },
        ],
      },
    ],
  });

  const router = useRouter();
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Create",
      children: (
        <div className="mt-10 flex flex-col px-20">
          <Create inspectionTemplate={inspectionTemplate} setinspectionTemplate={setinspectionTemplate} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Report",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Access",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="px-10 pt-10">
        <div className="flex gap-2">
          <Button
            type="text"
            ghost
            icon={<LeftOutlined />}
            onClick={() => router.push(`/inspection_templates`)}
          ></Button>

          <h1 className="text-xl font-semi font-medium">
            Create inspection template
          </h1>
        </div>
        <div className="flex justify-end">
          <Button type="primary">Save</Button>
        </div>
      </div>
      <div className="pt-5 px-10">
        <Tabs
          tabBarStyle={{ "border-bottom": "1px solid #ced3de" }}
          className="text-xl"
          items={items}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default createTemplate;
