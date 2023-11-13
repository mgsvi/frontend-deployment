"use client";
import { React, useState, useEffect } from "react";
import { Tabs, Button, message } from "antd";
import useSWR from "swr";
import Details from "./Details";
import Access from "./Access";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Popconfirm } from "antd";
import { LeftOutlined } from "@ant-design/icons";

function CategoryCreate({ params }) {
  const [Name, setName] = useState(params.name);
  const [updatePressed, setupdatePressed] = useState(false);
  const [issueCategoryExist, setissueCategoryExist] = useState(false);
  const [issueCategory, setissueCategory] = useState({
    name: Name,
    notify: [],
    questions: ["", ""],
    access: [
      {
        reportedBy: "one person",
        accessibleTo: ["some person"],
      },
    ],
  });

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onChange = (key) => {
    console.log(key);
  };
  const onClick = ({ key }) => {
    if (key == 1) {
      setdeleteAsset(params.asset);
      console.log(params.asset);
    }
  };

  const [activeKey, setactiveKey] = useState("1");
  useEffect(() => {
    fetch(`https://digifield.onrender.com/issues/get-issue-category/${params.name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data == null) {
          setissueCategoryExist(false);
        } else {
          console.log(data);
          setissueCategoryExist(true);
          setissueCategory(data);
          console.log(issueCategoryExist);
          console.log(data);
          
        }
        console.log(issueCategoryExist);
      });
  }, []);
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Delete</Menu.Item>
    </Menu>
  );

  console.log(JSON.stringify(issueCategory));

  

  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const warning = (msg) => {
    messageApi.open({
      type: "warning",
      content: msg,
    });
  };


  const items = [
    {
      key: "1",
      label: "Details",
      children: (
        <div className="mt-10 flex flex-col justify-center items-center">
          <Details
            setissueCategory={setissueCategory}
            issueCategory={issueCategory}
            moveToTab={setactiveKey}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Access",
      children: (
        <div className="mt-10 flex flex-col justify-center items-center">
          <Access
            updatePressed={updatePressed}
            setupdatePressed={setupdatePressed}
            moveToTab={setactiveKey}
            issueCategoryExist ={issueCategoryExist}
            issueCategory={issueCategory}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col">
      {contextHolder}
      <div className="px-10 pt-10 ">
        <div className="flex gap-2">
          <Button
            type="text"
            ghost
            icon={<LeftOutlined />}
            onClick={() => router.push(`/issues/categories`)}
          ></Button>

          <h1 className="text-xl font-semi font-medium">
            Create issue category{" "}
          </h1>
          <Popconfirm
            title="Delete the asset type"
            description="Performing this action will remove the Issue category type, are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              fetch(
                `https://digifield.onrender.com/issues/delete-issue_category/${name}`,
                {
                  method: "DELETE",
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data.acknowledge) {
                    success("Issue Category has been deleted");
                    router.push("/issues/categories");
                  } else {
                    warning(data.description);
                  }
                });
            }}
          >
            <button className="text-[#040303] bg-transparent hover:text-black text-lg justify-end">
              <EllipsisOutlined rotate={90} />
            </button>
          </Popconfirm>
        </div>
        <div className="pt-5">
          <Tabs
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            className="text-xl"
            items={items}
            onChange={onChange}
            activeKey={activeKey}
            onTabClick={(key) => setactiveKey(key)}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
export default CategoryCreate;
