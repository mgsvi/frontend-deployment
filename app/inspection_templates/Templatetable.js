import React, { useState } from 'react';
import { Table, Modal, Button, Dropdown, Menu, Divider } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";
import { GoCheckbox } from "react-icons/go"; 
import { TfiGallery } from "react-icons/tfi";
import { BiBell } from "react-icons/bi";
import { BiMessageDetail} from "react-icons/bi";



const Templatetable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'column1',
      key: 'column1',
    },
    {
      title: 'Scheduled',
      dataIndex: 'column2',
      key: 'column2',
    },
    {
      title: 'Owned By',
      dataIndex: 'column3',
      key: 'column3',
    },
    {
      title: 'Access',
      dataIndex: 'column4',
      key: 'column4',
    },
    {
      title: 'Action',
      key: 'actions',
      render: () => (
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button
            type="link"
            onClick={() => {
              setIsModalVisible(true);
            }}
            icon={<EllipsisOutlined className='rotate-90'/>}
          />
        </Dropdown>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span className="flex items-center text-lg">
          <GoCheckbox className="mr-2" /> Edit Template
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span className="flex items-center text-lg">
          <TfiGallery className="mr-2" /> Schedule
        </span>
      </Menu.Item>
      <Menu.Item key="3">
        <span className="flex items-center text-lg">
          <BiBell className="mr-2" /> Manage Access
        </span>
      </Menu.Item>
      <Menu.Item key="4">
        <span className="flex items-center text-lg">
          <BiMessageDetail className="mr-2" /> View Inspection
        </span>
      </Menu.Item>
      <div className="border-t border-gray-600 my-2"></div>
      <Menu.Item key="5">
        <span className="flex items-center text-lg">
          <GoCheckbox className="mr-2" /> Upload to Org.Library
        </span>
      </Menu.Item>
      <Menu.Item key="6">
        <span className="flex items-center text-lg">
          <GoCheckbox className="mr-2" /> Get QR Code
        </span>
      </Menu.Item>
    </Menu>
  );
  
  const data = [
    {
      key: '1',
      column1: 'Data 1',
      column2: 'Value 1',
    },
    {
      key: '2',
      column1: 'Data 2',
      column2: 'Value 2',
    },
    {
      key: '3',
      column1: 'Data 2',
      column2: 'Value 2',
    },
    {
      key: '4',
      column1: 'Data 2',
      column2: 'Value 2',
    },
    {
      key: '5',
      column1: 'Data 2',
      column2: 'Value 2',
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Templatetable;
