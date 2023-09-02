"use client";

import { React, useState } from "react";
import Link from "next/link";
import { Button, Space, ConfigProvider, Tag, Input, Modal, Tabs, Spin } from "antd";
import theme from "../themeConfig";
import { LoadingOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import AssetTable from "./AssetTable";
import { Card, Col, Row } from 'antd';
import useSWR from "swr";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const onChange = (key) => {
  console.log(key);
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const items = [
  {
    key: "1",
    label: `Table view`,
    children: (
      <div className="">
        <AssetTable />{" "}
      </div>
    ),
  },
  {
    key: "2",
    label: `Map view`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: "3",
    label: `Untagged assets`,
    children: `Content of Tab Pane 3`,
  },
];

const Page = () => {
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 1000 },
  );
    
  const [modal2Open, setModal2Open] = useState(false);

  return (
    <ConfigProvider theme={theme}>
      <div className="flex flex-col h-screen w-full p-4">
      
      <div className=" flex flex-row  mb-4 w-ful justify-between">
          <h1 className="text-xl font-semi font-semibold mb-5">Manage assets</h1>
          <div className="flex flex-row justify-end">
            <Link href="/assets/types">
              {" "}
              <Button>Manage types</Button>
            </Link>
            <Link href="/assets/create">
              <Button
                type="primary"
                className="ml-5"
                onClick={() => setModal2Open(true)}
              >
                Add asset
              </Button>
            </Link>
          </div>
        </div>
        <div className="">
        <Row gutter={10}>
    <Col span={4}>
      <Card title=" All Assets" bordered={true} style={{"alignItems":"right"}}>
       {data ? data.length : <Spin indicator={antIcon} />}   
      </Card>
    </Col>
    <Col span={4}>
      <Card title="Due for Inspection" bordered={true}>
        0
      </Card>
    </Col>
    <Col span={4}>
      <Card title="Issues Tagged" bordered={true}>
      0
        </Card>
    </Col>
  </Row>
        </div>
        
        <div className="w-full h-screen">
          <Tabs
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            items={items}
            onChange={onChange}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
