import React, { useState } from 'react';
import { Table, Modal, Button, Dropdown, Menu, Divider } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";
import { GoCheckbox } from "react-icons/go"; 
import { TfiGallery } from "react-icons/tfi";
import { BiBell } from "react-icons/bi";
import { BiMessageDetail} from "react-icons/bi";
import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Templatetable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Access',
      dataIndex: 'access',
      key: 'access',
      
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
         <Button type='link'>Archive</Button>
        </Space>
      ),
    },
  ];

  

  return (
    <div>
      <Table columns={columns}  />
    </div>
  );
};

export default Templatetable;
