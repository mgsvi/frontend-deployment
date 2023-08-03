"use client";

import React, { useState } from "react";
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ backgroundColor: "#002C4F" }} // Set the background color of the sidebar
    >
      <div className="demo-logo-vertical" />
      <Image src="/sidebariconexpanded.png" width={500} height={500} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ backgroundColor: "#002C4F" }}
      >
        {/* Menu items */}
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<IssuesCloseOutlined />}>
          Issues
        </Menu.Item>
        <Menu.Item key="3" icon={<ScheduleOutlined />}>
          Schedule
        </Menu.Item>
        <Menu.Item key="4" icon={<SecurityScanOutlined />}>
          Inspections
        </Menu.Item>
        <Menu.Item key="5" icon={<EditOutlined />}>
          Assets
        </Menu.Item>
        <Menu.Item key="6" icon={<PicCenterOutlined />}>
          Templates
        </Menu.Item>
        <Menu.Item key="7" icon={<TeamOutlined />}>
          Team
        </Menu.Item>

        {/* Move Settings and Logout to the bottom */}
        <Menu.Item
          key="8"
          icon={<SettingOutlined />}
          style={{ position: "absolute", bottom: 90 }}
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
