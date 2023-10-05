"use client"
import React, { useState } from 'react';
import { Table, Modal, Button, Popover } from 'antd';

const Inspectiontable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
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
        <Button
          type="link"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
        </Button>
      ),
    },
  ];

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
      <Popover content={content} title="Title">
  </Popover>
    </div>
  );
};

export default Inspectiontable;
