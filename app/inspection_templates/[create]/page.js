"use client";

import { React, useState, useEffect } from "react";
import { Button, Tabs, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Create from "./Create";
import LoadingIndicator from "@/app/loadingIndicator";
import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CreateTemplate({ params }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [savePressed, setsavePressed] = useState(false);
  const [templateAlreadyExists, settemplateAlreadyExists] = useState(false);
  const [inspectionTemplate, setinspectionTemplate] = useState({
    title: params.create,
    description: "this is a sample description",
    image: "http://example.com/url-of-image",
    assets: ["asset1", "asset2"],
    enforeAssetZone: true,
    createdAt: 19332489798,
    archived: false,
    access: ["Shraddha@blunav.in", "sussy_sushma@blunav.in"],
    multipleChoiceResponse: [
      [
        {
          optionName: "sampel1",
          flagged: true,
          color: "#111",
        },
        {
          optionName: "sampel2",
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
                  image: null,
                },
              },
            ],
          },
        ],
      },
    ],
  });
  const { data, error, isLoading } = useSWR(`https://digifield.onrender.com/inspections/get-inspection-template-by-title/${params.create}`, fetcher);

  useEffect(() => {
    if(data != null) {
      setinspectionTemplate(data)
      settemplateAlreadyExists(true)
    }
  }, [data])

  if(isLoading) {
    return <LoadingIndicator/>
  }

  if(error) {
    return <div>error occured</div>
  }
  
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

  const save = () => {
    setsavePressed(true);
    if (!templateAlreadyExists) {
      fetch(`https://digifield.onrender.com/inspections/create-inspection-template`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(inspectionTemplate),
      })
        .then((res) => res.json())
        .then((data) => {
          setsavePressed(false);
          console.log(data);
          if (data.acknowledge) {
            messageApi.open({
              type: "success",
              content: "Template has been created",
            });
          } else {
            messageApi.open({
              type: "error",
              content: data.description,
            });
          }
        });
    } else {
      fetch(`https://digifield.onrender.com/inspections/update-inspection-template/${params.create}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(inspectionTemplate),
      })
        .then((res) => res.json())
        .then((data) => {
          settemplateAlreadyExists(true);
          setsavePressed(false);
          console.log(data);
          if (data.acknowledge) {
            router.push(`/inspection_templates/${inspectionTemplate.title}`);
            messageApi.open({
              type: "success",
              content: "Template has been updated",
            });
          } else {
            messageApi.open({
              type: "error",
              content: data.description,
            });
          }
        });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {contextHolder}
      <div className="px-10 pt-10">
        <div className="flex gap-2">
          <Button
            type="text"
            ghost
            icon={<LeftOutlined />}
            onClick={() => router.push(`/inspection_templates`)}
          ></Button>

          <h1 className="text-xl font-semi font-medium">Create inspection template</h1>
        </div>
        <div className="flex justify-end">
          <Button loading={savePressed} onClick={save} type="primary">
            Save
          </Button>
        </div>
      </div>
      <div className="pl-10 h-full w-full">
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
