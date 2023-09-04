"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UploadOutlined,
  HomeOutlined,
  IssuesCloseOutlined,
  ScheduleOutlined,
  SecurityScanOutlined,
  LogoutOutlined,
  EditOutlined,
  PicCenterOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setselected] = useState(pathname.split("/")[1]);
  console.log(pathname.split("/")[1]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        backgroundColor: "#002C4F",
      }}
      // Set the background color of the sidebar
    >
      <div className="demo-logo-vertical" />
      <Image src="/sidebariconexpanded.png" width={500} height={500} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[selected]}
        style={{ backgroundColor: "#002C4F" }}
      >
        {/* Menu items */}
        <Menu.Item
          key=""
          icon={<HomeOutlined />}
          onClick={() => router.push("/")}
        >
          Home
        </Menu.Item>
        <Menu.Item
          key="issues"
          icon={<IssuesCloseOutlined />}
          onClick={() => router.push("/issues")}
        >
          Issues
        </Menu.Item>
        <Menu.Item
          key="schedule"
          icon={<ScheduleOutlined />}
          onClick={() => router.push("/schedule")}
        >
          Schedule
        </Menu.Item>

        <Menu.Item
          key="inspections"
          icon={<SecurityScanOutlined />}
          onClick={() => router.push("/inspections")}
        >
          Inspections
        </Menu.Item>

        <Menu.Item
          key="assets"
          icon={<EditOutlined />}
          onClick={() => router.push("/assets")}
        >
          Assets
        </Menu.Item>
        <Menu.Item
          key="templates"
          icon={<PicCenterOutlined />}
          onClick={() => router.push("/templates")}
        >
          Templates
        </Menu.Item>
        <Menu.Item
          key="team"
          icon={<TeamOutlined />}
          onClick={() => router.push("/team")}
        >
          Team
        </Menu.Item>

        {/* Move Settings and Logout to the bottom */}
        <Menu.Item
          key="settings"
          icon={<SettingOutlined />}
          style={{ position: "absolute", bottom: 90 }}
          onClick={() => router.push("/settings")}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          key="9"
          icon={<LogoutOutlined />}
          style={{ position: "absolute", bottom: 50 }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default App;
