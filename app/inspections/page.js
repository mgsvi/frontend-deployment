"use client"
import React from 'react'
import Templatetable from '../inspection_templates/Templatetable';
import { Input, Tabs } from 'antd';
import {SearchOutlined} from "@ant-design/icons"

function inspection() {
  
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Templates',
      children: (<div>
        <Templatetable/>
      </div>),
    },
    {
      key: '2',
      label: 'Archive',
      children: 'Content of Tab Pane 2',
    },
  ];
  return (
    <div className="flex flex-col p-10 h-full w-full">
      <div>
        <h1 className="text-xl font-semi bold mb-5">Inspections</h1>
      </div>
      <div className=" flex flex-row justify-between mb-4">
          <div className="flex">
            <Input
              // value={searchQuery}
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{ color: "#828282" }}
              // onChange={(e) => {
              //   setsearchQuery(e.target.value);
              // }}
            />
          </div>   
          
        </div>
        <div className="w-full h-full">
          <Tabs
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            items={items}
            onChange={onChange}
          />
        </div>
    </div>
  )
}

export default inspection