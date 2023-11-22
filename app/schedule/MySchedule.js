import React, { useState, useEffect } from "react";
import {
  FileExclamationOutlined,
  FileDoneOutlined,
  SmileOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { RightOutlined } from "@ant-design/icons";
import { Drawer, Button, Result, Divider } from "antd";
import LoadingIndicator from "../loadingIndicator";

function MySchedule({ inspections }) {
  const [groupedInspections, setgroupedInspections] = useState(null);
  const [drawerData, setDrawerData] = useState([]);

  useEffect(() => {
    let grouped = inspections.reduce((groups, inspection) => {
      const date = new Date(inspection.assignedAt).toDateString();
      if (!groups.hasOwnProperty(date)) {
        groups[date] = [];
      }
      groups[date].push(inspection);
      return groups;
    }, {});
    setgroupedInspections(grouped);
  }, [inspections]);
  console.log(inspections);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const formatTime = (time) => {
    const reportedTime = new Date(time);
    const hours = reportedTime.getHours();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${String(
      reportedTime.getMinutes()
    ).padStart(2, "0")} ${amPm}`;
    return `${formattedTime}`;
  };

  if (groupedInspections == null) return <LoadingIndicator />;
  if (Object.keys(groupedInspections).length == 0)
    return (
      <Result
        icon={<SmileOutlined />}
        title="You have no inspection scheduled!"
      />
    );

  const drawerContent = (
    <div className="p-3">
      <p className="font-semibold">Schedule title</p>
    </div>
  );

  const InspectionCard = ({ inspection }) => {
    const date = new Date(inspection.assignedAt);
    const today = new Date();

    const handleCardClick = (inspection) => {
      setDrawerVisible(true);
      console.log(inspection);
      setDrawerData(inspection);
    };

    return (
      <Button
        className="flex flex-row w-full h-fit bg-white p-3 rounded-lg items-center justify-between"
        onClick={() => handleCardClick(inspection)}
      >
        <div className="flex flex-row w-full h-fit gap-3 justify-start">
          {date < today ? (
            <FileDoneOutlined
              className={
                inspection.status === "completed"
                  ? "text-[#219653]"
                  : "text-[#C62F35]"
              }
            />
          ) : (
            <FileDoneOutlined
              className={
                inspection.status === "completed"
                  ? "text-[#219653]"
                  : "text-[#FE8B0F]"
              }
            />
          )}
          <div className="flex flex-col w-full h-fit items-start">
            <p className="text-[#183348] gap-2">{inspection.title}</p>
            <div className="text-sm text-gray-500">
              {formatTime(inspection.startTime)} -{" "}
              {formatTime(inspection.endTime)}
            </div>
          </div>
        </div>
        <div className="flex w-fit flex-none mr-4">
          {(() => {
            if (inspection.status !== "completed" && date < today)
              return <p className="text-[#C62F35] text-sm">Overdue</p>;
            else if (inspection.status === "completed")
              return <p className="text-[#2F80ED] text-sm">Done</p>;
            else if (inspection.status !== "completed" && date > today)
              return <p className="text-[#FE8B0F] text-sm">Upcoming</p>;
            else return <p className="text-[#183348] text-xs">Due today</p>;
          })()}
        </div>
      </Button>
    );
  };
  const date = new Date(drawerData.assignedAt);
  const today = new Date();
  return (
    <div className="flex flex-col w-full h-full ">
      {Object.keys(groupedInspections).map((key) => {
        return (
          <div className="flex flex-col h-full" key={key}>
            <p className="text-[#7E8A9C] mb-4">
              {key}
              {key === new Date().toDateString() ? ", Today" : ""}
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {groupedInspections[key].map((inspection) => {
                return (
                  <InspectionCard
                    key={inspection.id} // Add a unique key
                    inspection={inspection}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <Drawer
        title={(() => {
          if (drawerData.status !== "completed" && date < today)
            return <p className=" text-sm ">Overdue Inspection</p>;
          else if (drawerData.status === "completed")
            return <p className="text-sm ">Completed Inspection</p>;
          else if (drawerData.status !== "completed" && date > today)
            return (
              <p className="text-[#FE8B0F] text-sm">Upcoming Inspection</p>
            );
          else return <p className="text-[#183348] text-xs">Due today</p>;
        })()}
        placement="right"
        className="bg-[#CED3DE]"
        closable={true}
        onClose={() => {
          setDrawerVisible(false);
          setDrawerData(null);
        }}
        visible={drawerVisible}
        width={450}
      >
        {drawerData !== null && (
          <div>
            <div className="bg-white">
              <div className=" font-semibold">{drawerData.title}</div>
              <div className="pt-5">
                <p className="text-sm text-gray-500">Schedule Window</p>
                <div className=" text-sm">
                  {formatTime(drawerData.startTime)} -{" "}
                  {formatTime(drawerData.endTime)}
                </div>
              </div>
              <div className="pt-5">
                <p className="text-sm text-gray-500">Assigned By</p>
                <div>{drawerData.assignedTo}</div>
              </div>
              <div className="pt-5">
                <p className="text-sm text-gray-500">Assets</p>
                <div>New Assets</div>
              </div>
            </div>
            <Divider />
            <div className="m-5 rounded-lg bg-white border py-3 px-3">
              <div className="pt-5">
                <p className="text-sm text-gray-500">Assigned To</p>
                <div>{drawerData.assignedTo}</div>
              </div>
              <div>
                <Button type="primary" className="my-3 w-full">Start Inspection</Button>
              </div>
              <div>
                <Button danger className="my-3 w-full">Skip Inspection</Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default MySchedule;
