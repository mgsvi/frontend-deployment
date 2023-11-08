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
import { Button, Layout, Menu, theme } from "antd";
import { MdOutlineEditLocation } from "react-icons/md";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

const SideBar = () => {
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

  const menuItems = [
    {
      key: "",
      label: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      key: "issues",
      label: "Issues",
      icon: <IssuesCloseOutlined />,
    },
    {
      key: "schedule",
      label: "Schedule",
      icon: <ScheduleOutlined />,
    },
    {
      key: "inspections",
      label: "Inspections",
      icon: <SecurityScanOutlined />,
    },
    {
      key: "assets",
      label: "Assets",
      icon: <EditOutlined />,
    },
    {
      key: "inspection_templates",
      label: "Templates",
      icon: <PicCenterOutlined />,
    },
    {
      key: "team",
      label: "Team",
      icon: <TeamOutlined />,
    },
  ];

  const bottomMenuItems = [
    { key: "settings", label: "Settings", icon: <SettingOutlined /> },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];
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
      <div className={`flex flex-col h-full justify-between`}>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={[selected]}
          style={{ backgroundColor: "#002C4F" }}
          onClick={(e) => {
            router.push(`/${e.key}`);
          }}
        />

        <Menu
          className={collapsed ? "mb-[120px]" : "mb-[160px]"}
          theme="dark"
          mode="inline"
          items={bottomMenuItems}
          defaultSelectedKeys={[selected]}
          style={{ backgroundColor: "#002C4F" }}
          onClick={(e) => {
            if (e.key == "settings") {
              router.push(`/${e.key}`);
            }
          }}
        />
      </div>
    </Sider>
  );
};
export default SideBar;
