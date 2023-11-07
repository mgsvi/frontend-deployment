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
import { MdOutlineEditLocation } from "react-icons/md";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname.split("/")[1]);
  console.log(pathname.split("/")[1]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      style={{
        backgroundColor: "#002C4F",
      }}
    >
      {collapsed ? (
        <div className="mt-4 flex justify-center items-center">
          <MdOutlineEditLocation
            onClick={toggleCollapsed}
            className="text-white text-2xl mt-5 mb-10 items-center"
          />
        </div>
      ) : (
        <>
          <div className="demo-logo-vertical" />
          <Image
            src={"/sidebariconexpanded.png"}
            alt="side-bar"
            width={500}
            height={500}
          />
        </>
      )}
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
          onClick={() => router.push("/inspection_templates")}
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
