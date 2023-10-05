"use client";
import { React, useState, useEffect } from "react";
import { Tabs, Button, message } from "antd";
import useSWR from "swr";
import Details from "./Details";
import Access from "./Access";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Popconfirm, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CategoryCreate({ params }) {
  const name = params.name;
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 10000 }
  );
  const onChange = (key) => {
    console.log(key);
  };
  const onClick = ({ key }) => {
    if (key == 1) {
      setdeleteAsset(params.asset);
      console.log(params.asset);
    }
  };

  const [formData, setFormData] = useState([]);
  const [activeKey, setactiveKey] = useState("1");

  const updateDetailsData = (data) => {
    setFormData({ ...formData, questions: data.questions, name: data.name });
  };

  useEffect(() => {
    fetch(`https://digifield.onrender.com/issues/get-issue-category/${name}`)
  
    return () => {
      second
    }
  }, [third])
  
 
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Delete</Menu.Item>
    </Menu>
  );

  const updateAccessData = (data) => {
    setFormData({ ...formData, updatecategory: true });
  };

  console.log(formData);

  const handleSubmit = () => {
    const category = {
      name: formData.name,
      notify: [],
      questions: formData.questions,
      access: [],
    };
    console.log(JSON.stringify(category));

    fetch("https://digifield.onrender.com/issues/create-issue-category", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Response:", res);
          return res.text();
        }
        return res.json();
      })
      .then((data) => {
        if (data.acknowledge) {
          success("Category has been created");
          
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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


  useEffect(() => {
    if (formData.updatecategory) {
      console.log(formData.updatecategory + "new");
      handleSubmit();
    }
  }, [formData]);

  const items = [
    {
      key: "1",
      label: "Details",
      children: (
        <div className="mt-10 flex flex-col justify-center items-center">
          <Details
            name={name}
            onDataUpdate={updateDetailsData}
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
          <Access onDataUpdate={updateAccessData} moveToTab={setactiveKey} />
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col">
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
                <button className="text-[#040303] bg-transparent hover:text-black text-lg">
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
