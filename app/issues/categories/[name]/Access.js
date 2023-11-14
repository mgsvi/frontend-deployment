import { React, useState } from "react";
import { Input, Divider, Button, Form, Space, message } from "antd";
import { useRouter } from "next/navigation";

function Access({
  updatePressed,
  setupdatePressed,
  issueCategoryExist,
  issueCategory,
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  return (
    <div className="w-[700px]">
      {contextHolder}
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

      <Button
        loading={updatePressed}
        type="primary"
        className="mb-3 mr-2"
        onClick={() => {
          setupdatePressed(true);

          if (issueCategoryExist) {
            fetch(
              `https://digifield.onrender.com/issues/update-issue-category/${issueCategory.name}`,
              {
                method: "PUT",
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
                setupdatePressed(false);
                if (!res.ok) {
                  console.error("Response:", res);
                  return res.text();
                }

                return res.json();
              })
              .then((data) => {
                if (data.acknowledge) {
                  success("Category has been Updated");
                  router.push("/issues/categories");
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
