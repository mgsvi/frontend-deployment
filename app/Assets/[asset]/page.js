"use client";
import { React, useState, useEffect } from "react";
import {
  Col,
  Divider,
  Row,
  Button,
  Tabs,
  Image,
  Popconfirm,
  Dropdown,
  Menu,
  Form,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import { message, Space } from "antd";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function ViewAsset({ params }) {
  const [showMore, setShowMore] = useState(false);
  const [deleteAsset, setdeleteAsset] = useState(null);
  const [locationAvailable, setlocationAvailable] = useState(false);
  const [location, setlocation] = useState([]);
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-asset-types/",
    fetcher,
    { refreshInterval: 10000 }
  );
  const [assetValues, setassetValues] = useState({});
  useEffect(() => {
    fetch(
      `https://digifield.onrender.com/assets/get-assets-by-id/${params.asset}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          setassetValues(data);
        }
        if (data.type_fields.Location) {
          setlocationAvailable(true);
          setlocation(data.type_fields.Location);
          console.log("hey");
          console.log(location.lat, location.lng);
          console.log("hello");
        }
      });
  }, [data]);

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
  };
  const err = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "This is a warning message",
    });
  };


  const router = useRouter();
  const onClick = ({ key }) => {
    if (key == 2) {
      router.push(`/assets/${params.asset}/edit`);
    }
    if (key == 1) {
      setdeleteAsset(params.asset);
      console.log(params.asset);
    }
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="2">Edit</Menu.Item>
      <Menu.Item key="1">Delete</Menu.Item>
    </Menu>
  );
  let temp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `All`,
      children: "tab 1",
    },
    {
      key: "2",
      label: `Issues`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `Inspections`,
      children: `Content of Tab Pane 3`,
    },
    {
      key: "4",
      label: `History`,
      children: `Content of Tab Pane 4`,
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col px-32 pt-10 gap-4 overflow-y-auto">
      <div class="flex justify-between">
        <h1 class="text-xl font-semibold">{assetValues.asset_name}</h1>
        <div class="flex-grow"></div>
        <Dropdown overlay={menu} onClick={menu} >
          <EllipsisOutlined rotate={90} />
        </Dropdown>

        <Popconfirm
          title="Delete the asset "
          description="Performing this action will remove the asset , are you sure?"
          okText="Yes"
          open={deleteAsset}
          cancelText="No"
          onConfirm={() => {
            fetch(
              `https://digifield.onrender.com/assets/delete-asset/${assetValues.asset_id}`,
              {
                method: "DELETE",
              }
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.acknowledge) {
                  success("Asset has been deleted");
                  router.push("/assets");
                } else {
                  warning(data.description);
                }
              });
          }}
        ></Popconfirm>
      </div>

      <div className="h-full w-full ">
        <Row justify="space-between">
          <Col span={15}>
            <div className="flex justify-start align-top p-3 bg-white rounded gap-3">
              <Image
                className="rounded-md"
                width={200}
                height={200}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <div className="mr-2 text-[#828282] flex flex-col gap-3">
                <div>
                  <p>Unique Id</p>
                  <p className="text-black ">{assetValues.asset_id}</p>
                </div>
                <div>
                  <p>Display Name</p>
                  <p className="text-black">{assetValues.asset_name}</p>
                </div>
                <div>
                  <p>Type</p>
                  <p className="text-black">{assetValues.type}</p>
                </div>
                <div>
                  <p>Site</p>
                  <p className="text-black">
                    {assetValues && assetValues.type_fields
                      ? assetValues.type_fields.Site
                      : "N/A"}
                  </p>
                </div>
                <div className="align left">
                  {showMore ? (
                    <div className="flex flex-col gap-3">
                      {console.log(assetValues.type_fields)}
                      {Object.entries(assetValues.type_fields).map(
                        ([key, value]) => {
                          if (
                            key === "Location" &&
                            typeof value === "object" &&
                            value !== null
                          ) {
                            return (
                              <div key={key}>
                                <p>{key}</p>
                                <div>
                                  <p className="text-black">
                                    Latitude: {value.lat}
                                  </p>
                                  <p className="text-black">
                                    Longitude: {value.lng}
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={key}>
                              <p>{key}</p>
                              <p className="text-black">{value}</p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className=""></div>
                  )}
                  <Button
                    className=""
                    type="link"
                    onClick={() => setShowMore(!showMore)}
                    block
                  >
                    {showMore ? "Hide" : "View all details"}{" "}
                  </Button>
                </div>
              </div>
            </div>
          </Col>
          {locationAvailable && (
          <Col span={8} className="bg-white rounded max-h-fit">            
              <div className="flex justify-center align-middle p-3">
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={13}
                  style={{ width: "100%", height: "220px" }}
                >               
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[location.lat, location.lng]}></Marker>
                </MapContainer>
              </div>
          </Col>
          )}
        </Row>
      </div>
      <div className="h-full w-full">
        <Row justify="space-between">
          <Col span={10}>
            <div>
              <h1 className="py-4 font-semibold text-lg">Images</h1>
              <div class="grid grid-cols-4 bg-white rounded p-3 h-[200px] overflow-y-auto">
                <Image.PreviewGroup>
                  {temp.map((i) => {
                    return (
                      <Image
                        width={100}
                        className="p-0 m-0 mb-4"
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                      />
                    );
                  })}
                </Image.PreviewGroup>
              </div>
              <div>
                <h1 className="py-4 font-semibold text-lg rounded">
                  Documents
                </h1>
                <div className="bg-white rounded p-2">
                  <Button type="link" className="font-semibold">
                    Instruction Manual
                  </Button>
                  <div>
                    <Button type="link" className="font-semibold">
                      Wiring Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={13}>
            <Tabs
              tabBarStyle={{ "border-bottom": " 1px solid #ced3de" }}
              items={items}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ViewAsset;

/*image prev
import React from 'react';
import { Image } from 'antd';
const App = () => (
  <Image.PreviewGroup
    preview={{
      onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
    }}
  >
    <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
    <Image
      width={200}
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    />
  </Image.PreviewGroup>
);
export default App;

grid pannirukom paaru
*/
