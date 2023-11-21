import React, { useState } from 'react';
import { Table, Drawer, Button, Popover, Input, Dropdown,Divider } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { RightOutlined } from '@ant-design/icons';

const Inspectiontable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
 
  const onMenuClick = (e) => {
    console.log('click', e);
  };
  const items = [
    {
      key: '1',
      label: '1st item',
    },
    {
      key: '2',
      label: '2nd item',
    },
    {
      key: '3',
      label: '3rd item',
    },
  ];
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => <strong>{text}</strong>,
    },
    {
      title: 'Name',
      dataIndex: 'column1',
      key: 'column1',
    },
    {
      title: 'Action',
      dataIndex: 'column2',
      key: 'column2',
    },
    {
      title: 'Score',
      dataIndex: 'column3',
      key: 'column3',
    },
    {
      title: 'Conducted',
      dataIndex: 'column4',
      key: 'column4',
    },
    {
      title: 'Duration',
      dataIndex: 'column5', // Use a unique key for each column
      key: 'column5',
    },
    {
      title: 'Status',
      dataIndex: 'column6', // Use a unique key for each column
      key: 'column6',
    },
    {
      title: '-',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setIsModalVisible(true);
            // Show the drawer when the "Report" button is clicked
            setDrawerVisible(true);
          }}
        >
          View Report
        </Button>
      ),
    },
  ];

  // Content of the drawer (you can customize it)
  const drawerContent = (
    <div className="p-3">
      <p className='font-semibold'>Inspection title given by the user</p>
  
      {/* Buttons */}
      <div className='mt-3 flex space-x-4 p-2'>
        <Button type="primary" className="w-32">
          View Report
        </Button>
        <Dropdown.Button overlay={{ items, onClick: onMenuClick }} className="w-28">
          PDF
        </Dropdown.Button>
        <Button type="primary" className="w-27">
          Share
        </Button>
      </div>
  
      {/* Divider */}
      <Divider className="mt-5" />
  
      {/* Details on left */}
      <div className="flex flex-row mt-5 items-center justify-between">
        <p>Details on left</p>
        
          <Button type="link" onClick={() => console.log('Add actions clicked')}>
            Add Actions +
          </Button>
        
      </div>
  
      {/* Rounded Card */}
      <div className="mt-5 rounded-lg bg-gray-100 p-4">
        <p>Rounded Card Content</p>
      </div>
    </div>
  );
  
  
  
  
  
  
  
  
  
  
  
  const data = [
    {
      key: '1',
      date: '14 Feb',
      subTableData: [
        // Sub-table data for Date 1
        {
          key: '1-1',
          column1: 'Title',
          column2: '2',
          column3: '33/100',
          column4: 'DD/MM/YY',
          column5: '49 mins',
          column6: 'Completed',
        },
        // Add more sub-table rows if needed
        {
          key: '1-1',
          column1: 'Sub Data 1-1',
          column2: 'Sub Value 1-1',
          column3: 'Sub Score 1-1',
          column4: 'Sub Conducted 1-1',
          column5: 'Sub Duration 1-1',
          column6: 'Sub Status 1-1',
        },
      ],
    },
    {
      key: '2',
      date: '15 Feb',
      
      subTableData: [
        {
          key: '2-1',
          column1: 'Sub Data 2-1',
          column2: 'Sub Value 2-1',
          column3: 'Sub Score 2-1',
          column4: 'Sub Conducted 2-1',
          column5: 'Sub Duration 2-1',
          column6: 'Sub Status 2-1',
        },
      ],
    },
  ];

  const expandedRowRender = (record) => {
    if (record.subTableData) {
      return <Table columns={columns.slice(1)} dataSource={record.subTableData} pagination={false} />;
    } else {
      return null; 
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            style={{ color: "#828282" }}
          />
        </div>
      </div>
      <Table columns={columns} dataSource={data} expandable={{ expandedRowRender }} />
      <Popover content={content} title="Title">
        {/* Add content for the Popover */}
      </Popover>
      {/* Drawer for the report */}
      <Drawer
       title={
             <div className="flex items-center justify-between">
               <span>Completed Inspection</span>
               <RightOutlined style={{ marginLeft: '8px' }} />
             </div>}
       placement="right"
       closable={true}
       onClose={() => setDrawerVisible(false)}
       visible={drawerVisible}
       width={450}>
       {drawerContent}
      </Drawer>

    </div>
  );
};

export default Inspectiontable;
