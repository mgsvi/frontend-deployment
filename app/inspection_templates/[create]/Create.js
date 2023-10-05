import { React, useState } from "react";
import {
  LoadingOutlined,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { message, Upload, Input, Form } from "antd";
import { BiSolidImageAdd } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import FormItem from "antd/lib/form/FormItem";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function Create({ name }) {
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [Name, setName] = useState(name);
  const [isNameEditEnabled, setisNameEditEnabled] = useState(false);
  const [form] = Form.useForm();
  const uniqueId = self.crypto.randomUUID();
  form.setFieldsValue({ "Unique Id": uniqueId });
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <BiSolidImageAdd
          size={50}
          color="#BFC6D4"
          className="flex items-center"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        <div className="flex flex-col justify-center pl-10 w-[50%]">
          <Form form={form}>
            <Form.Item name="">
              {isNameEditEnabled ? (
                <div className="flex">
                  <Input
                    className="text-2xl font-semi bold "
                    value={Name}
                    onChange={(e) => {
                      setName(e.target.value);
                      form.setFieldsValue({ templateName: e.target.value });
                    }}
                  />
                  <button
                    onClick={() => {
                      setisNameEditEnabled(!isNameEditEnabled);
                    }}
                    style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                  >
                    <CheckOutlined />
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <h1 className="text-2xl font-semi bold mr-5">{Name}</h1>
                  <button
                    onClick={() => {
                      setisNameEditEnabled(!isNameEditEnabled);
                    }}
                    style={{ fontSize: 14, backgroundColor: "#EBEEF3" }}
                  >
                    <MdEdit size={20} color="#7E8A9C" />
                  </button>
                </div>
              )}
            </Form.Item>
            <Form.Item name="" required={true}>
              <TextArea autoSize placeholder="Brief description of the inspection" bordered={true} className="bg[#EBEEF3]">
                
              </TextArea>
              
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Create;