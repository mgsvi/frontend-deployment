"use client";
import { React, useState } from "react";
import Link from "next/link";
import { Button, ConfigProvider, Tabs, Card, Col, Row, Modal, Input, message } from "antd";
import theme from "../themeConfig";
import { LoadingOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import LoadingIndicator from "../loadingIndicator";
import ManageShedtable from "./ManageShedtable";
import Missedinspectable from "./Missedinspectable";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Page = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data, error, isLoading } = useSWR("https://digifield.onrender.com/issues/get-all-issues", fetcher, {
    refreshInterval: 1000,
  });

  const [modal2Open, setModal2Open] = useState(false);
  const [selectedTab, setSelectedTab] = useState("2");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const router = useRouter();

  const onChange = (key) => {
    console.log(key);
    setSelectedTab(key);
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>error</div>;

  return (
    <ConfigProvider theme={theme}>
      {contextHolder}
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex flex-row mb-4 w-full justify-between">
          <h1 className="text-xl font-semi font-semibold mb-5">Schedule</h1>
          <div className="flex flex-row justify-end">
            

            <Button type="primary" className="ml-5" onClick={() => setModal2Open(true)}>
              Schedule Inspection
            </Button>
            <Modal
              title="Schedule Inspection"
              centered
              open={modal2Open}
              onOk={() => {
                if (scheduleTitle != "") {
                  setModal2Open(false);
                  router.push(`/schedule/${scheduleTitle}`);
                } else {
                  messageApi.open({
                    type: "warning",
                    content: "Issue name cannot be empty",
                  });
                }
              }}
              onCancel={() => setModal2Open(false)}
            >
              <p className="mt-3">Title</p>
              <Input
                placeholder=""
                value={scheduleTitle}
                onChange={(e) => {
                  setScheduleTitle(e.target.value);
                }}
              />
            </Modal>
          </div>
        </div>

        {/* Conditionally render the dashboard cards */}
        {selectedTab !== "1" && (
          <div className="w-full mb-4">
            <Row gutter={10}>
              <Col span={4}>
                <Card title="My Inspections Today" bordered={true}>
                  {data ? data.length : <LoadingOutlined />}
                </Card>
              </Col>
              <Col span={4}>
                <Card title="Missed Inspections" bordered={true}>
                  2
                </Card>
              </Col>
              <Col span={4}>
                <Card title="Late Inspections" bordered={true}>
                  1
                </Card>
              </Col>
            </Row>
          </div>
        )}

        <div className="w-full h-full">
          <Tabs tabBarStyle={{ borderBottom: "1px solid #ced3de" }} defaultActiveKey="2" onChange={onChange}>
            <Tabs.TabPane key="1" tab="My Schedule">
              {
                
              }
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="Manage Schedule">
              {
               <ManageShedtable/>
              }
            </Tabs.TabPane>
            <Tabs.TabPane key="3" tab="Late/ Missed Inspections">
                 <Missedinspectable/>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
