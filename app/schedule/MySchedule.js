import React, { useState, useEffect } from "react";
import { FileExclamationOutlined, FileDoneOutlined, SmileOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { RightOutlined } from "@ant-design/icons";
import { Drawer, Button, Result } from "antd";
import LoadingIndicator from "../loadingIndicator";

function MySchedule({ inspections }) {
  const [groupedInspections, setgroupedInspections] = useState(null);

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

  const [drawerVisible, setDrawerVisible] = useState(false);

  const formatTime = (time) => {
    const reportedTime = new Date(time);
    const hours = reportedTime.getHours();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${String(reportedTime.getMinutes()).padStart(2, "0")} ${amPm}`;
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

    const handleCardClick = () => {
      setDrawerVisible(true);
    };

    return (
      <Button
        className="flex flex-row w-full h-fit bg-white p-3 rounded-lg items-center justify-between"
        onClick={handleCardClick}
      >
        <div className="flex flex-row w-full h-fit gap-3 justify-start">
          {date < today ? (
            <FileDoneOutlined className={inspection.status === "completed" ? "text-[#219653]" : "text-[#C62F35]"} />
          ) : (
            <FileDoneOutlined className={inspection.status === "completed" ? "text-[#219653]" : "text-[#FE8B0F]"} />
          )}
          <div className="flex flex-col w-full h-fit items-start">
            <p className="text-[#183348]">{inspection.title}</p>
            <div className="text-sm text-gray-500">
              {formatTime(inspection.startTime)} - {formatTime(inspection.endTime)}
            </div>
          </div>
        </div>
        <div className="flex w-fit flex-none mr-4">
          {(() => {
            if (inspection.status !== "completed" && date < today)
              return <p className="text-[#C62F35] text-sm">Overdue</p>;
            else if (inspection.status === "completed") return <p className="text-[#2F80ED] text-sm">Done</p>;
            else if (inspection.status !== "completed" && date > today)
              return <p className="text-[#FE8B0F] text-sm">Upcoming</p>;
            else return <p className="text-[#183348] text-xs">Due today</p>;
          })()}
        </div>
      </Button>
    );
  };

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
        title={
          <div className="flex items-center justify-between">
            <span>Completed Inspection</span>
          </div>
        }
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={450}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}

export default MySchedule;
