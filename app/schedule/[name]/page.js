"use client";
import { React, useState, useEffect } from "react";
import { Button, Input, Select, Checkbox, message, TimePicker, DatePicker, Popconfirm } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";

import MultipleDatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

import "../styles.css";
import LoadingIndicator from "@/app/loadingIndicator";

function Page({ params }) {
  const [Template, setTemplate] = useState(null);
  const [scheduleExists, setscheduleExists] = useState(null);
  const [Name, setName] = useState(params.name);
  const [Assets, setAssets] = useState("");
  const [submitPressed, setsubmitPressed] = useState(false);
  const [deletePressed, setdeletePressed] = useState(false)
  const router = useRouter();
  const [repeatAtFrequency, setrepeatAtFrequency] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [ScheduleInspection, setScheduleInspection] = useState({
    title: Name,
    template: null,
    createdAt: Date.now(),
    site: [],
    assets: [],
    createdBy: "wiz@oxford.in",
    assignedTo: [],
    frequency: {
      value: null,
      startDate: null,
      endDate: null,
      repeatAt: [],
      startTime: null,
      endTime: null,
    },
    allowLateSubmission: true,
    isPaused: false,
  });

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

  const err = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  useEffect(() => {
    fetch(`https://digifield.onrender.com/schedule/get-schedule-by-title/${Name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          setScheduleInspection(data);
          setscheduleExists(true);
        } else {
          setscheduleExists(false);
        }
      });

    fetch(`https://digifield.onrender.com/inspections/get-all-inspection-templates`)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => ({
          value: item.title,
          label: item.title,
        }));
        setTemplate(names);
      });

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

  if (scheduleExists == null) return <LoadingIndicator />;

  const submit = () => {
    setsubmitPressed(true);
    if (ScheduleInspection.template == null) {
      warning("Template cannot be empty, please select one...");
      return;
    }
    if (ScheduleInspection.assignedTo.length === 0) {
      warning("Please select atleast one person to assign this schedule to...");
      return;
    }
    for (let key in ScheduleInspection.frequency) {
      if (ScheduleInspection.frequency[key] == null) {
        warning(`Frequency cannot be empty...`);
        return;
      }
    }
    const startDate = dayjs(ScheduleInspection.frequency.startDate);
    const endDate = dayjs(ScheduleInspection.frequency.endDate);
    const diff = endDate.diff(startDate, "day");
    let tempRepeatAt = [startDate];
    switch (ScheduleInspection.frequency.value) {
      case "daily":
        while (tempRepeatAt[tempRepeatAt.length - 1].add(1, "day").isSameOrBefore(endDate)) {
          tempRepeatAt.push(tempRepeatAt[tempRepeatAt.length - 1].add(1, "day"));
        }
        break;
      case "weeklyOnce":
        while (tempRepeatAt[tempRepeatAt.length - 1].add(1, "week").isSameOrBefore(endDate)) {
          tempRepeatAt.push(tempRepeatAt[tempRepeatAt.length - 1].add(1, "week"));
        }
        break;
      case "monthlyOnce":
        while (tempRepeatAt[tempRepeatAt.length - 1].add(1, "month").isSameOrBefore(endDate)) {
          tempRepeatAt.push(tempRepeatAt[tempRepeatAt.length - 1].add(1, "month"));
        }
        break;
      default:
        break;
    }
    if (ScheduleInspection.frequency.value != "custom") {
      let newFrequency = { ...ScheduleInspection.frequency };
      newFrequency.repeatAt = tempRepeatAt.map((item) => item.valueOf());
      setScheduleInspection({ ...ScheduleInspection, frequency: newFrequency });
    }
    console.log(JSON.stringify(ScheduleInspection));
    if (scheduleExists) {
      fetch(`http://localhost:8001/schedule/update-schedule/${Name}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(ScheduleInspection),
      })
        .then((res) => {
          setsubmitPressed(false);
          if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
          }
          console.log(res);
          return res.json();
        })
        .then((data) => {
          setsubmitPressed(false);
          if (data.acknowledge) {
            success("Schedule has been updated");
            if (Name != ScheduleInspection.title) router.push(`/schedule/${ScheduleInspection.title}`);
          } else {
            console.log(data);
            err(data.description);
          }
        })
        .catch((error) => {
          setsubmitPressed(false);
          console.log(error);
          err("An unknown error occured");
        });
    } else {
      fetch(`https://digifield.onrender.com/schedule/create-schedule`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(ScheduleInspection),
      })
        .then((res) => {
          setsubmitPressed(false);
          if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
          }
          console.log(res);
          return res.json();
        })
        .then((data) => {
          setsubmitPressed(false);
          if (data.acknowledge) {
            success("Schedule has been created");
            setscheduleExists(true);
            if (Name != ScheduleInspection.title) router.push(`/schedule/${ScheduleInspection.title}`);
          } else {
            console.log(data);
            err(data.description);
          }
        })
        .catch((error) => {
          setsubmitPressed(false);
          console.log(error);
          err("An unknown error occured");
        });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full px-10 pt-10 overflow-visible">
      {contextHolder}
      <div className="flex h-fit w-full">
        <div className="flex h-fit w-full">
          <div className="flex gap-2 h-fit">
            <Button type="text" ghost icon={<LeftOutlined />} onClick={() => router.push(`/schedule`)}></Button>
            <h1 className="text-xl font-semi font-medium">Schedule Inspection</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pt-52 h-full overflow-y-auto">
        <div className="flex flex-col w-[700px] bg-white rounded-lg p-6 mb-5">
          <div className="flex flex-col mt-2">
            <h2 className="mb-2 text-[#333] text-lg">
              Template<span className="text-red-600">*</span>
            </h2>
            <Select
              className="w-full"
              loading={Template == null}
              showSearch
              placeholder="Select template..."
              filterOption={(input, option) => (option?.label ?? "").includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={ScheduleInspection.template}
              style={{
                width: 650,
              }}
              onChange={(val) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  template: val,
                });
              }}
              options={Template ?? []}
            />
          </div>
          <div className="flex flex-col pt-10">
            <h2 className="mb-2 text-[#333] text-lg">Site</h2>
            <Select
              className="w-full"
              mode="tags"
              showSearch
              value={ScheduleInspection.site}
              placeholder="Select Site..."
              style={{
                width: 650,
              }}
              options={[
                {
                  value: "Runway AD - 1",
                  label: "Runway AD - 1",
                },
                {
                  value: "Offshore Checkpoint Block 1",
                  label: "Offshore Checkpoint Block 1",
                },
              ]}
              onChange={(value) => {
                setScheduleInspection({ ...ScheduleInspection, site: value });
              }}
            />
          </div>
          <div className="flex flex-col pt-10">
            <h2 className="mb-2 text-[#333] text-lg">Assets</h2>
            <Select
              className="w-full"
              mode="tags"
              showSearch
              value={ScheduleInspection.assets}
              placeholder="select Assets..."
              style={{
                width: 650,
              }}
              onChange={(value) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  assets: value,
                });
              }}
              options={Assets}
            />
          </div>
          <div className="flex flex-col pt-10">
            <h2 className="mb-2 text-[#333] text-lg">
              Assigned To<span className="text-red-600">*</span>
            </h2>
            <Select
              disabled={scheduleExists}
              className="w-full"
              mode="tags"
              showSearch
              value={ScheduleInspection.assignedTo}
              placeholder="Assigned To..."
              style={{
                width: 650,
              }}
              options={[
                {
                  value: "jessica@blunav.in",
                  label: "jessica@blunav.in",
                },
                {
                  value: "madison@blunav.in",
                  label: "madison@blunav.in",
                },
              ]}
              onChange={(value) => {
                setScheduleInspection({
                  ...ScheduleInspection,
                  assignedTo: value,
                });
              }}
            />
          </div>
          <div className="flex flex-col pt-10 items-start">
            <h2 className="mb-2 text-[#333] text-lg">
              Frequency<span className="text-red-600">*</span>
            </h2>
            <RangePicker
              disabled={scheduleExists}
              className="mb-5"
              disabledDate={(current) => current && current < dayjs().endOf("day")}
              value={
                ScheduleInspection.frequency.startDate != null && ScheduleInspection.frequency.endDate != null
                  ? [dayjs(ScheduleInspection.frequency.startDate), dayjs(ScheduleInspection.frequency.endDate)]
                  : null
              }
              onChange={(dates, dateStrings, info) => {
                const newFrequency = { ...ScheduleInspection.frequency };
                newFrequency.startDate = dates != null ? dates[0].valueOf() : null;
                newFrequency.endDate = dates != null ? dates[1].valueOf() : null;
                if (newFrequency.startDate != null && newFrequency.endDate != null) {
                  newFrequency.repeatAt = newFrequency.repeatAt.filter((date) =>
                    dayjs(date).isBetween(newFrequency.startDate, newFrequency.endDate)
                  );
                } else newFrequency.repeatAt = [];
                setScheduleInspection({ ...ScheduleInspection, frequency: newFrequency });
              }}
            />
            <Select
              disabled={scheduleExists}
              className="w-full mb-5"
              placeholder="Select scheduling frequency..."
              value={ScheduleInspection.frequency.value}
              style={{
                width: 650,
              }}
              onChange={(value) => {
                const newFrequency = { ...ScheduleInspection.frequency };
                newFrequency.value = value;
                setScheduleInspection({ ...ScheduleInspection, frequency: newFrequency });
              }}
              options={[
                {
                  value: "daily",
                  label: "Daily",
                },
                {
                  value: "weeklyOnce",
                  label: "Weekly Once",
                },
                {
                  value: "monthlyOnce",
                  label: "Monthly Once",
                },
                {
                  value: "custom",
                  label: "Custom",
                },
              ]}
            />

            {ScheduleInspection.frequency.value == "custom" && (
              <div className="mb-5 text-base w-full">
                <p className="mb-2">Please Select the custom dates</p>
                <MultipleDatePicker
                  disabled={scheduleExists}
                  inputClass="custom-input"
                  className="custom-calendar"
                  placeholder="Select custom dates"
                  monthYearSeparator="-"
                  format="YYYY-MM-DD"
                  value={ScheduleInspection.frequency.repeatAt}
                  onChange={(dates) => {
                    const newFrequency = { ...ScheduleInspection.frequency };
                    newFrequency.repeatAt = dates.map((date) => date.valueOf());
                    setScheduleInspection({ ...ScheduleInspection, frequency: newFrequency });
                    console.log(ScheduleInspection);
                  }}
                  multiple
                  plugins={[<DatePanel key={"1"} position="left" />]}
                  minDate={ScheduleInspection.frequency.startDate ?? dayjs().valueOf()}
                  maxDate={dayjs(ScheduleInspection.frequency.endDate).valueOf()}
                />
              </div>
            )}

            <TimePicker.RangePicker
              className="mb-5"
              use12Hours
              format="h:mm a"
              value={
                ScheduleInspection.frequency.startTime != null && ScheduleInspection.frequency.endTime != null
                  ? [dayjs(ScheduleInspection.frequency.startTime), dayjs(ScheduleInspection.frequency.endTime)]
                  : null
              }
              onChange={(dates, dateStrings, info) => {
                const newFrequency = { ...ScheduleInspection.frequency };
                newFrequency.startTime = dates != null ? dates[0].valueOf() : null;
                newFrequency.endTime = dates != null ? dates[1].valueOf() : null;
                setScheduleInspection({ ...ScheduleInspection, frequency: newFrequency });
              }}
            />
          </div>
          <Checkbox
            checked={ScheduleInspection.allowLateSubmission}
            onChange={(e) => {
              setScheduleInspection({ ...ScheduleInspection, allowLateSubmission: e.target.checked });
            }}
          >
            Allow inspections to be submitted after the due date
          </Checkbox>
          <div className="pt-10">
            <h2 className="mb-2 text-[#333] text-lg">
              Title<span className="text-red-600">*</span>
            </h2>
            <Input
              className="mb-5"
              value={ScheduleInspection.title}
              onChange={(e) => {
                setName(e.target.value);
                setScheduleInspection({
                  ...ScheduleInspection,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex flex-row w-full justify-between gap-3">
            <div className="flex flex-row gap-3">
              <Button disabled={submitPressed} loading={submitPressed} type="primary" onClick={submit}>
                {scheduleExists ? "Update" : "Create"}
              </Button>
              <Button
                type="primary"
                ghost
                style={{ background: "white" }}
                onClick={() => {
                  router.push("/schedule");
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="flex flex-row gap-3">
              <Popconfirm
                title="Delete the schedule"
                description="Are you sure to delete this schedule?"
                onConfirm={() => {
                  setdeletePressed(true)
                  fetch(`https://digifield.onrender.com/schedule/delete-schedule/${Name}`, { method: "DELETE" })
                    .then((res) => res.json())
                    .then((data) => {
                      if (!data.acknowledge) {
                        setdeletePressed(false)
                        err("Unable to delete the schedule");
                      } else {
                        success(`${decodeURI(Name)} schedule has been deleted`)
                        setTimeout(() => {
                          router.push('/schedule');
                      }, 1000);
                      }
                    });
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button disabled={deletePressed} loading={deletePressed} danger>Delete</Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
