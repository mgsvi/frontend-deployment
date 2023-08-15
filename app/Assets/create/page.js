"use client";
import React from "react";
import { Form, Input, Button } from "antd";

const AddAssetForm = () => {
  const onFinish = (values) => {
    // Handle form submission here
    console.log("Form submitted with values:", values);
  };

  return (
    <Form name="addAssetForm" onFinish={onFinish}>
      <Form.Item
        label="Asset Name"
        name="assetName"
        rules={[{ required: true, message: "Please enter asset name" }]}
      >
        <Input />
      </Form.Item>
      {/* Add more form fields as needed */}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddAssetForm;
