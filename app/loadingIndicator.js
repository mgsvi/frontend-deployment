import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const LoadingIndicator = () => (
  <div className="h-full w-full flex justify-center items-center">
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  </div>
);
export default LoadingIndicator;
