import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

import Swayam from "../src/views/admin/swayam/index";

// Auth Imports
import SignIn from "views/auth/SignIn";

import { FaDiscourse } from "react-icons/fa";
import Course from "../src/views/admin/course/index";
import Updates from '../src/views/admin/updates/index';

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

import { BsRobot } from "react-icons/bs";

import { PiNotification } from "react-icons/pi";
import ExtensionMarketplace from "views/extension";



// const routes = [
//   {
//     name: "Dashboard",
//     layout: "/admin",
//     path: "default",
//     icon: <MdHome className="h-6 w-6" />,
//     component: <MainDashboard />,
//   },
//   // {
//   //   name: "NFT Marketplace",
//   //   layout: "/admin",
//   //   path: "nft-marketplace",
//   //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
//   //   component: <NFTMarketplace />,
//   //   secondary: true,
//   // },
//   {
//     name: "Data Tables",
//     layout: "/admin",
//     icon: <MdBarChart className="h-6 w-6" />,
//     path: "data-tables",
//     component: <DataTables />,
//   },
//   {
//     name: "Profile",
//     layout: "/admin",
//     path: "profile",
//     icon: <MdPerson className="h-6 w-6" />,
//     component: <Profile />,
//   },
//   {
//     name: "Sign In",
//     layout: "/auth",
//     path: "sign-in",
//     icon: <MdLock className="h-6 w-6" />,
//     component: <SignIn />,
//   },
//   // {
//   //   name: "RTL Admin",
//   //   layout: "/rtl",
//   //   path: "rtl",
//   //   icon: <MdHome className="h-6 w-6" />,
//   //   component: <RTLDefault />,
//   // },
// ];

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    showInMenu: true, 
  },
  {
    name: "Swayam AI",
    layout: "/admin",
    path: "swayam",
    icon: <BsRobot className="h-6 w-6" />,
    component: <Swayam />,
    showInMenu: true,
  },
  {
    name: "Updates",
    layout: "/admin",
    path: "updates",
    icon: <PiNotification className="h-6 w-6" />,
    component: <Updates />,
    showInMenu: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    showInMenu: false,
  },
  {
    name: "Course",
    layout: "/admin",
    path: "course",
    icon: <FaDiscourse className="h-6 w-6" />,
    component: <Course />,
    showInMenu: true, // Hidden from the menu
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    showInMenu: true,
  },
  {
    name: "Extensions",
    layout: "/admin",
    path: "ex",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ExtensionMarketplace />,
    showInMenu: true,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    showInMenu: false, // Hidden from the menu
  },
  {
    name: "Hidden Route Example",
    layout: "/admin",
    path: "hidden-route",
    component: <NFTMarketplace />, 
    showInMenu: false, 
  },
  
];


export default routes;

