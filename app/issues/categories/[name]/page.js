"use client";
import { React, useState } from "react";
import { Tabs } from "antd";
import useSWR from "swr";
import Details from "./Details";
import Access from "./Access";
import { useRouter } from "next/navigation";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CategoryCreate() {
  const router = useRouter();
  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 10000 }
  );
  const onChange = (key) => {
    console.log(key);
  };
  
  const [formData, setFormData] = useState([]);
  const [activeKey, setactiveKey] = useState("1");
  
  if(updatecategory=== "true"){
    
  }

  const updateDetailsData = (data) => {
    setFormData({ ...formData, questions: data.questions, name: data.name });
  };

  const updateAccessData = (data) => {
    setFormData({ ...formData, updatecategory:true  });
  };
  
  console.log(formData);
  const items = [
    {
      key: "1",
      label: "Details",
      children: (
        <div className="mt-10 flex flex-col justify-center items-center">
          <Details onDataUpdate={updateDetailsData} moveToTab={setactiveKey} />
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
        <div>
          <h1 className="text-xl font-semi font-medium">
            Create issue category{" "}
          </h1>
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
