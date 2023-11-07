"use client";

import { React, useState } from "react";
import { Button, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Create from "./Create";

function CreateTemplate({ params }) {
  console.log(params.create);
  const [inspectionTemplate, setinspectionTemplate] = useState({
    title: "sample Template Title",
    description: "this is a sample description",
    image: "http://example.com/url-of-image",
    assets: ["asset1", "asset2"],
    enforeAssetZone: true,
    createdAt: 19332489798,
    access: ["Shraddha@blunav.in", "sussy_sushma@blunav.in"],
    multipleChoiceResponse: [
      [
        {
          optionName: "sampel1",
          flagged: true,
          color: "#111",
        },
        {
          optionName: "sampel1",
          flagged: true,
          color: "#111",
        },
      ],
    ],
    pages: [
      {
        pageTitle: "Basic Details",
        sections: [
          {
            sectionName: "Primary",
            questions: [
              {
                questionTitle: "this is the question title",
                responseType: {
                  type: "text",
                  required: true,
                  logic: [
                    {
                      condition: "",
                      value: "",
                      action: ["reportIssue"],
                    },
                  ],
                  format: "shortAnswer",
                  image: null
                },
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
        <div className=" flex flex-col ">
          <Create
            inspectionTemplate={inspectionTemplate}
            setinspectionTemplate={setinspectionTemplate}
          />
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
      <div className="pl-10 ">
        <Tabs
          tabBarStyle={{ "border-bottom": "1px solid #ced3de" }}
          className="text-xl "
          items={items}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default CreateTemplate;
