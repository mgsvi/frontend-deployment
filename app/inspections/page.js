"use client"
import React from 'react'
import Templatetable from '../inspection_templates/Templatetable';
import { Input, Tabs } from 'antd';
import {SearchOutlined} from "@ant-design/icons"
import Inspectiontable from "./Inspectiontable";
import { Card, Col, Row } from "antd";

function inspection() {
  
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Inspections',
      children: (<div>
        <Inspectiontable/>
      </div>),
    },
    {
      key: '2',
      label: 'Late Inspections',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Missed Inspections',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '4',
      label: 'Archive',
      children: 'Content of Tab Pane 2',
    },
  ];
  return (
    <div className="flex flex-col p-10 h-full w-full">
      <div>
        <h1 className="text-xl font-semi bold mb-5">Inspections</h1>
      </div>
      <div className="">
          <Row gutter={10}>
            <Col span={4}>
              <Card
                title="Inspections today"
                bordered={true}
                style={{ alignItems: "right" }}
              >
                10
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Late Inspections" bordered={true}>
                0
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Missed Inspections" bordered={true}>
                0
              </Card>
            </Col>
          </Row>
        </div>

        <div className="w-full h-full">
          <Tabs
          className='mt-2 ,ml-2'
            tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
            items={items}
            onChange={onChange}
          />
        </div>
        
    </div>
  )
}

export default inspection