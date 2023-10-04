import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Result, Select, Modal, Button, Space } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import useSWR from "swr";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";
import { Questrial } from "next/font/google";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const AssetTable = () => {
  const router = useRouter();
  const [departmentFilter, setdepartmentFilter] = useState([]);
  const [typefilter, settypefilter] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false); // State to control the download confirmation modal
  const { data, error, isLoading } = useSWR(
    "https://digifield.onrender.com/assets/get-all-assets",
    fetcher,
    { refreshInterval: 1000 }
  );
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  let columns = [
    {
      title: "Asset name",
      dataIndex: "asset_name",
      ...getColumnSearchProps("asset_name"),
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText, searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Asset Id",
      dataIndex: "asset_id",
      ...getColumnSearchProps("asset_id"),
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText, searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      filters: departmentFilter,
      onFilter: (value, record) => record.department === value,
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: typefilter,
      onFilter: (value, record) => record.type === value,
      render: (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchQuery]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
  ];

  const showDownloadModal = () => {
    setIsDownloadModalVisible(true);
  };

  const handleDownload = () => {
    const excel = new Excel();
    excel
      .addSheet("Asset Data")
      .addColumns(
        columns.map((column) => ({
          title: column.title,
          dataIndex: column.dataIndex,
        }))
      )
      .addDataSource(data)
      .saveAs("AssetData.xlsx");

    setIsDownloadModalVisible(false); 
  };

  const handleCancelDownload = () => {
    setIsDownloadModalVisible(false);
  };

  const downloadAsExcel = () => {
    showDownloadModal(); 
  };

  if (error)
    return (
      <div>
        <Result
          status="warning"
          title="There are some problems with loading the fields."
        />
      </div>
    );
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 48px - 131px - 48px - 32px)" }}
    >
      <div className="flex mb-3 w-full justify-between">
        <Input
          value={searchQuery}
          placeholder="Search"
          allowClear
          prefix={<SearchOutlined />}
          style={{
            color: "#828282",
            marginRight: 10,
            width: "300px",
          }}
          onChange={(e) => {
            setsearchQuery(e.target.value);
          }}
        />
        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          onClick={downloadAsExcel}
        ></Button>
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
          columns={columns}
          dataSource={data.filter((val) => {
            return (
              searchQuery === "" ||
              val.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              val.asset_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              val.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              val.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push(`/assets/${record.asset_id}`);
              },
            };
          }}
          rowClassName="hover: cursor-pointer"
          size="small"
          sticky
        />
      </div>
    </div>
  );
};
export default AssetTable;
