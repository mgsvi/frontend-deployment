"use client";

import { React, useState } from "react";
import { Button, Space, ConfigProvider, Tag, Input, Modal } from "antd";
import theme from "../../themeConfig";
import { SearchOutlined } from "@ant-design/icons";
import TypeTable from "./Table";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [modal2Open, setModal2Open] = useState(false);
  const [assetTypeName, setassetTypeName] = useState("");
  const [searchQuery, setsearchQuery] = useState("")
  


  return (
    <ConfigProvider theme={theme}>
      <div className="flex flex-col w-full p-4">
        <h1 className="text-xl font-semi bold mb-5">Manage asset types</h1>

        <div className=" flex flex-row justify-between mb-4">
          <div className="flex">
            <Input
            value={searchQuery}
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{ color: "#828282" }}
              onChange={e=>{
                setsearchQuery(e.target.value)
              }}
            />
          </div>

          <Button type="primary" onClick={() => setModal2Open(true)}>
            create Type
          </Button>

          {/* popup */}
          <Modal
            title="Create new type"
            centered
            open={modal2Open}
            onOk={() => {
              setModal2Open(false);
              router.push(`/assets/types/${assetTypeName}`);
            }}
            onCancel={() => setModal2Open(false)}
          >
            <p className="mt-3">Name of type</p>
            <Input
              placeholder=""
              value={assetTypeName}
              onChange={(e) => {
                setassetTypeName(e.target.value);
              }}
            />
          </Modal>
        </div>
        <div className="w-full">
          <TypeTable searchQuery={searchQuery}/>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
