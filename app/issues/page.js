"use client";

import { React, useState } from "react";
import Link from "next/link";
import { Button, ConfigProvider, Tabs, Card, Col, Row } from "antd";
import theme from "../themeConfig";
import { LoadingOutlined } from "@ant-design/icons";
import IssueTable from "./IssueTable";
import Mapview from "./Mapview";
import useSWR from "swr";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Page = () => {
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/issues/get-all-issues",
    fetcher,
    { refreshInterval: 1000 }
  );

  const [modal2Open, setModal2Open] = useState(false);
  const [selectedTab, setSelectedTab] = useState("2"); 

  const onChange = (key) => {
    console.log(key);
    setSelectedTab(key);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex flex-row mb-4 w-full justify-between">
          <h1 className="text-xl font-semi font-semibold mb-5">Issues</h1>
          <div className="flex flex-row justify-end">
          <Link href="/issues/categories">
              {" "}
              <Button>Manage categories</Button>
            </Link>
            <Link href="/issues/categories">
              <Button
                type="primary"
                className="ml-5"
                onClick={() => setModal2Open(true)}
              >
                Report Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Conditionally render the dashboard cards */}
        {selectedTab !== "1" && (
          <div className="w-full mb-4">
            <Row gutter={10}>
              <Col span={4}>
                <Card title="Unassigned High Priority" bordered={true}>
                  {data ? data.length : <LoadingOutlined />}
                </Card>
              </Col>
              <Col span={4}>
                <Card title="No Updates for 3 Days" bordered={true}>
                  2
                </Card>
              </Col>
              <Col span={4}>
                <Card title="High Priority Open" bordered={true}>
                  3
                </Card>
              </Col>
            </Row>
          </div>
        )}

        <div className="w-full h-full">
          <Tabs
            tabBarStyle={{ borderBottom: "1px solid #ced3de" }}
            defaultActiveKey="2"
            onChange={onChange}
          >
            <Tabs.TabPane key="1" tab="Dashboard">
              {<div className="w-full mb-4">
            <Row gutter={10}>
              <Col span={4}>
                <Card title="Unassigned High Priority" bordered={true}>
                  {data ? data.length : <LoadingOutlined />}
                </Card>
              </Col>
              <Col span={4}>
                <Card title="No Updates for 3 Days" bordered={true}>
                  2
                </Card>
              </Col>
              <Col span={4}>
                <Card title="High Priority Open" bordered={true}>
                  3
                </Card>
              </Col>
            </Row>
          </div>}
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="Table view">
              <IssueTable />
            </Tabs.TabPane>
            <Tabs.TabPane key="3" tab="Mapview">
              <Mapview />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;


