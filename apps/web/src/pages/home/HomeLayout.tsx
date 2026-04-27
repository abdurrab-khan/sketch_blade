import React from "react";
import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

export default function HomeLayout() {
  return (
    <React.Fragment>
      <Navbar />
      <Outlet />
    </React.Fragment>
  );
}
