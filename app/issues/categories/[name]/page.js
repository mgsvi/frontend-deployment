"use client";

import React from "react";
import { Tabs } from "antd";
import Details from "./Details";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: `Details`,
    children: <div className="mt-10 flex flex-col justify-center items-center "><Details/></div>,
  },
  {
    key: "2",
    label: `Access`,
    children: <div className=""></div>,
  },
];

function CategoryCreate() {
  return (
    <div className="flex flex-col">
      <div className="px-10 pt-10 ">
        <div>
          <h1 className="text-xl font-semi font-medium">
            Create issue category{" "}
          </h1>
        </div>
        <div className="pt-5">
        <Tabs
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            className="text-xl"
            items={items}
            onChange={onChange}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default CategoryCreate;
