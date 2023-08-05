"use client";
import React from "react";
import { useRouter } from "next/navigation";

function page({params}) {
  const router = useRouter();
  return <p>Post: {params.name}</p>;
  
}
export default page;
