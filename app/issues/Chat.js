import React from 'react';
import { Card, Input } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';

const Chat = () => {
  return (
<div className="bg-[#E9EDF6] h-full">
      <div>
        <Card
          bordered={false}
          className="w-48 p-2 rounded-lg bg-green-200 text-gray-700 mb-4 ml-5 mt-5"
          headStyle={{ display: 'none' }}
          bodyStyle={{ padding: 0 }}
        >
          <p className="border-b-2 border-green-300 text-sm p-2">
            Sample WhatsApp message
          </p>
        </Card>
      </div>

      <div className="bg-white border-t border-gray-300 p-2 w-full fixed bottom-0">
          <div className="flex items-center">
             <PictureOutlined className="text-2xl text-gray-500" />
             <Input placeholder="Type a message" className="rounded-full border border-gray-300 p-1 flex-1 mx-2" />
             <SendOutlined className="text-2xl text-green-500" />
          </div>
       </div>
</div>
  );
};

export default Chat;