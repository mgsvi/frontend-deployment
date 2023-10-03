import { React, useState } from "react";
import { Input, Divider, Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";


function Access({ onDataUpdate }) {
  const [accessData, setAccessData] = useState({});
  const router = useRouter();
  const [updatecategory, setupdatecategory] = useState(false);
  console.log(updatecategory);
  const onFinish = () => {
    setAccessData({});
    onDataUpdate(accessData);
  };

  return (
    <div className="w-[700px]">
      <div className="bg-white p-6 rounded-lg  ">
        <p className="mb-2 text-[#333] text-sm ">
          {" "}
          Access to Reported Issues<span className="text-red-600"></span>
        </p>
        <p className="mb-2 text-[#333] text-sm">
          {" "}
          Give Access to the following people while reporting observation
          <span className="text-red-600"></span>
        </p>
        <Divider />
        <div className="flex flex-row justify-between">
          <p className="text-sm">When reported by</p>
          <p className="text-sm">"Observation" will be visible to"</p>
        </div>
        <Divider />
        <Divider />
        <Button
          type="primary"
          ghost
          className="mr-5 w-[20%] mt-2"
          style={{ background: "white" }}
        >
          Edit Access
        </Button>
      </div>

      <Button type="primary" className="mr-5 w-[20%] mt-5" onClick={()=>{
          onDataUpdate({updatecategory : true})
          setupdatecategory(true)
          router.push("/issues/categories");
      }}>Save and Apply</Button>

      <Button
        type="primary"
        ghost
        className="mr-5 w-[20%] mt-5"
        style={{ background: "white" }}
        onClick={() => {
          router.push("/issues/categories");
        }}
      >
        Cancel
      </Button>
    </div>
  );
}

export default Access;
