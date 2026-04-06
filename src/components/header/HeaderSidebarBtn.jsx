"use client";
import { useContext } from "react";
import { SideBarContext } from "@/context/SideBarContext";
export const HeaderSidebarBtn = () => {
  const { swapStateNav } = useContext(SideBarContext);
  
  return (
    <button style={{outline:'unset'}} onClick={swapStateNav}>
      <i className="ic_Category" />
    </button>
  );
};
