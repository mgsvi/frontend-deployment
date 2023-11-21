"use client";

import { React, useState, useEffect } from "react";
import { Button, Input, Select, Checkbox, message, TimePicker } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
function page({ params }) {
  const [Template, setTemplate] = useState("");
  const [Name, setName] = useState(params.name);
  const [Assets, setAssets] = useState("");
  const router = useRouter();
  const [values, setValues] = useState([
    new DateObject().subtract(4, "days"),
    new DateObject().add(4, "days"),
  ]);
  const [messageApi, contextHolder] = message.useMessage();
  const [ScheduleInspection, setScheduleInspection] = useState({
    title: Name,
    template: "",
    site: ["site1"],
    assets: ["new asset"],
    assignedTo: ["Jessica@gmail.com"],
    frequency: {
      repeatAt: ["everyday"],
      startTime: 1635249073907,
      endTime: 1635249073907,
    },
    allowLateSubmission: true,
    isPaused: false,
  });

  console.log(JSON.stringify(ScheduleInspection));

  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const warning = (msg) => {
    messageApi.open({
      type: "warning",
      content: msg,
    });
  };

  useEffect(() => {
    fetch(
      `https://digifield.onrender.com/inspections/get-all-inspection-templates`
    )
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => ({
          value: item.title,
          label: item.title,
        }));
        setTemplate(names);
      });
  }, []);

  useEffect(() => {
    fetch(`https://digifield.onrender.com/assets/get-all-assets`)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => ({
          value: item.asset_name,
          label: item.asset_name,
        }));
        setAssets(names);
      });
  }, []);

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div className="px-10 pt-10 ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              type="text"
              ghost
              icon={<LeftOutlined />}
              onClick={() => router.push(`/schedule`)}
            ></Button>

            <h1 className="text-xl font-semi font-medium">
              Schedule Inspection
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-5">
        <div className="w-[700px] bg-white rounded-lg p-6  items-center mb-5">
          <div className="mt-2">
            <h2 className="mb-2 text-[#333] text-lg">
              Template<span className="text-red-600">*</span>
            </h2>
            <Select
              className="w-full"
              showSearch
              optionFilterProp="children"
              labelInValue
              defaultValue={{
                label: "select Inspection Template...",
              }}
              style={{
                width: 650,
              }}
              onChange={(e) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  template: e.value,
                });
              }}
              options={Template}
            />
          </div>
          <div className="pt-10">
            <h2 className="mb-2 text-[#333] text-lg">Site</h2>
            <Select
              className="w-full"
              mode="tags"
              showSearch
              optionFilterProp="children"
              labelInValue
              placeholder="Select Site..."
              style={{
                width: 650,
              }}
              //   onChange={handleChange}
              //   options={}
            />
          </div>
          <div className="pt-10">
            <h2 className="mb-2 text-[#333] text-lg">Assets</h2>
            <Select
              className="w-full"
              mode="tags"
              showSearch
              optionFilterProp="children"
              labelInValue
              placeholder="select Assets..."
              style={{
                width: 650,
              }}
              onChange={(e) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  assets: e.map((i) => i.value),
                });
                console.log(e.map((i) => i.value));
              }}
              options={Assets}
            />
          </div>
          <div className="pt-10">
            <h2 className="mb-2 text-[#333] text-lg">
              Assigned To<span className="text-red-600">*</span>
            </h2>
            <Select
              className="w-full"
              showSearch
              optionFilterProp="children"
              labelInValue
              placeholder="Assigned To..."
              style={{
                width: 650,
              }}
              //   onChange={handleChange}
              //   options={}
            />
          </div>
          <div className="pt-10 items-center">
            <h2 className="mb-2 text-[#333] text-lg">Frequency</h2>
            <Select
              className="w-full"
              showSearch
              optionFilterProp="children"
              labelInValue
              defaultValue={{
                label: "Monthly Once",
              }}
              style={{
                width: 650,
              }}
              onChange={(e) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  frequency: e.value,
                });
              }}
              options={[
                {
                  value: "Monthly Once",
                  label: "Monthly Once",
                },
                {
                  value: "Weekly Once",
                  label: "Weekly Once",
                },
                {
                  value: "Daily",
                  label: "Daily",
                },
              ]}
            />
            <DatePicker value={values} onChange={setValues} range />

            <TimePicker.RangePicker />
            <div className="flex flex-row items-center mt-5">
              <Checkbox />

              <h3 className="mb-2 text-[#333] text-sm ml-3 items-center">
                Allow inspections to be submitted after the due date
              </h3>
            </div>
            <div>
              <h2 className="mb-2 text-[#333] text-lg">
                Title<span className="text-red-600">*</span>
              </h2>
              <Input
                value={Name}
                onChange={(e) => {
                  setName(e.target.value);
                  setScheduleInspection({
                    ...ScheduleInspection,
                    title: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div>
            <Button
              type="primary"
              className="mr-5 w-[20%] mt-5"
              onClick={() => {
                fetch(
                  "https://digifield.onrender.com/schedule/create-schedule",
                  {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                      accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ScheduleInspection),
                  }
                )
                  .then((res) => {
                    if (!res.ok) {
                      console.error("Response:", res);
                      return res.text();
                    }
                    return res.json();
                  })
                  .then((data) => {
                    if (data.acknowledge) {
                      success("Schedule has been created");
                      router.push("/issues/categories");
                    } else {
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
            >
              Create
            </Button>
            <Button
              type="primary"
              ghost
              className="mr-5 w-[20%] mt-5"
              style={{ background: "white" }}
              onClick={() => {
                router.push("/schedule");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
