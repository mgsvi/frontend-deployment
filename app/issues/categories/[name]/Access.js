import { React, useState } from "react";
import { Input, Divider, Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

function Access({ updatePressed, setupdatePressed, issueCategoryExist }) {
  const router = useRouter();

  return (
    <div className="w-[700px]">
      <div className="bg-white p-6 rounded-lg  ">
        <p className="mb-2 text-[#333] text-sm ">
          {" "}
          Access to Reported Issues<span className="text-red-600"></span>
        </p>
        <p className="mb-2 text-[#333] text-sm">
          {" "}
          Give Access to the following people while reporting observation
          <span className="text-red-600"></span>
        </p>
        <Divider />
        <div className="flex flex-row justify-between">
          <p className="text-sm">When reported by</p>
          <p className="text-sm">Observation will be visible to</p>
        </div>
        <Divider />
        <Divider />
        <Button
          type="primary"
          ghost
          className="mr-5 w-[20%] mt-2"
          style={{ background: "white" }}
        >
          Edit Access
        </Button>
      </div>

      {/* <Button
        type="primary"
        className="mr-5 w-[20%] mt-5"
        onClick={() => {
          setUpdateData(true);
          console.log(UpdateData);
          router.push("/issues/categories");
        }}
      >
        Save and Apply
      </Button> */}
      <Button
        loading={updatePressed}
        type="primary"
        className="mb-3 mr-2"
        onClick={() => {
          setupdatePressed(true);
          console.log(JSON.stringify(assetType));

          if (issueCategoryExist) {
            fetch(
              "https://digifield.onrender.com/issues/create-issue-category",
              {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(issueCategory),
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
                  success("Category has been created");
                } else {
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            fetch(
              "https://digifield.onrender.com/issues/create-issue-category",
              {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(issueCategory),
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
                  success("Category has been created");
                } else {
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        }}
      >
        {issueCategoryExist == true ? "Update and Apply" : "Create and Apply"}
      </Button>

      <Button
        type="primary"
        ghost
        className="mr-5 w-[20%] mt-5"
        style={{ background: "white" }}
        onClick={() => {
          router.push("/issues/categories");
        }}
      >
        Cancel
      </Button>
    </div>
  );
}

export default Access;
