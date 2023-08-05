"use client";

import { React, useState } from "react";
import Link from "next/link";
import { Button, Space, ConfigProvider, Tag, Input, Modal } from "antd";
import theme from "../themeConfig";
import { SearchOutlined } from "@ant-design/icons";

const page = () => {
  const [modal2Open, setModal2Open] = useState(false);

  return (
    <ConfigProvider theme={theme}>
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-semi bold mb-5">Manage assets</h1>

        <div className=" flex flex-row justify-between mb-4">
          <div className="flex">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{ color: "#828282" }}
            />
          </div>
          <Link href="/assets/types">
            {" "}
            <Button>Manage types</Button>
            <Button
              type="primary"
              className="ml-5"
              onClick={() => setModal2Open(true)}
            >
              Add asset
            </Button>
          </Link>
        </div>
        <div className="w-full"></div>
      </div>
    </ConfigProvider>
  );
};

export default page;
