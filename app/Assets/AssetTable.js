import React, { useState, useEffect } from "react";
import { Table, Input, Result, Select } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel"; 
import useSWR from "swr";
import Loading from "../loading";
import { FloatButton } from 'antd';
import { Modal } from 'antd';
import { useRouter } from "next/navigation";
const fetcher = (...args) => fetch(...args).then((res) => res.json()); 

const AssetTable = () => {
  const router=useRouter();
  const [departmentFilter, setdepartmentFilter] = useState([]);
  const [typefilter, settypefilter] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(["asset_id", "asset_name", "department", "type"]);
  const [searchQuery, setsearchQuery] = useState("");
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher, 
    { refreshInterval: 1000 }
  );
useEffect(() => {
  
  fetch("https://digifield.onrender.com/assets/get-all-assets")
      .then((res) => res.json())
      .then((assets) => {
        let departments = [];
        let types = [];
        for (let asset of assets) {
          if (!departments.includes(asset.department)) {
            departments.push(asset.department);
          }
          if (!types.includes(asset.type)) {
            types.push(asset.type);
          }
        }
        setdepartmentFilter(
          departments.map((val) => {
            return { text: val, value: val };
          })
        );
        settypefilter(
          types.map((val) => {
            return { text: val, value: val };
          })
        );
      });
  }, [data]);

  let columns = [
    {
      title: "Asset name",
      dataIndex: "asset_name",
    },
    {
      title: "Asset Id",
      dataIndex: "asset_id",
    },
    {
      title: "Department",
      dataIndex: "department",
      filters: departmentFilter,
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: typefilter,
      onFilter: (value, record) => record.type === value,
    },
  ];

  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false); // State to control the download confirmation modal

  const showDownloadModal = () => {
    setIsDownloadModalVisible(true);
  };

  const handleDownload = () => {
    // Perform the download logic here
    const excel = new Excel();
    excel
      .addSheet("Asset Data")
      .addColumns(filteredColumns.map((column) => ({ title: column.title, dataIndex: column.dataIndex })))
      .addDataSource(data)
      .saveAs("AssetData.xlsx");
    
    setIsDownloadModalVisible(false); // Close the modal after download
  };

  const handleCancelDownload = () => {
    setIsDownloadModalVisible(false); // Close the modal if "Cancel" is clicked
  };

  useEffect(() => {
    let temp = columns.filter((col) => selectedColumn.includes(col.dataIndex));
    setFilteredColumns(temp);
  }, [selectedColumn]);

  const downloadAsExcel = () => {
    showDownloadModal(); // Show the download confirmation modal
  };

  if (error)
    return (
      <div>
        <Result status="warning" title="There are some problems with loading the fields." />
      </div>
    );
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 48px - 131px - 48px - 32px)" }}>
      <div className="flex mb-3 w-full">
        <Input
          value={searchQuery}
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ color: "#828282", marginLeft: 10, marginRight: 10, width: "300px" }}
          onChange={(e) => {
            setsearchQuery(e.target.value);
          }}
        />
        <Select
          mode="multiple"
          defaultValue={["asset_id", "asset_name", "department", "type"]}
          value={selectedColumn}
          maxTagCount={"responsive"}
          className="w-[300px]"
          onChange={(value) => setSelectedColumn(value)}
        />
        <FloatButton
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadAsExcel}
        > </FloatButton>
        <Modal
          title="Download Confirmation"
          visible={isDownloadModalVisible}
          onOk={handleDownload} 
          onCancel={handleCancelDownload} 
        >
          <p>Do you want to download the Excel file of Asset Table?</p>
        </Modal>
      </div>
      <div>
        <Table
          style={{ maxHeight: "100%" }}
          columns={filteredColumns}
          dataSource={data.filter((val) => {
            return (
              searchQuery === "" ||
              val.asset_id.toLowerCase().includes(searchQuery) ||
              val.asset_name.toLowerCase().includes(searchQuery) ||
              val.department.toLowerCase().includes(searchQuery) ||
              val.type.toLowerCase().includes(searchQuery)
            );
          })}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push(`/assets/${record.asset_id}`);
              },
            };
          }}
          size="small"
          sticky
        />
      </div>
    </div>
  );
};

export default AssetTable;
