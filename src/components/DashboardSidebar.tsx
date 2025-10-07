"use client";

import React from "react";
import Link from "next/link";
import { MdDashboard, MdCategory } from "react-icons/md";
import { FaBagShopping, FaRegUser, FaGear, FaTable } from "react-icons/fa6";

const DashboardSidebar = () => {
  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold px-6 py-4 border-b border-blue-500">
        Admin Panel
      </h2>

      <nav className="flex-1">
        <SidebarLink href="/dashboard/admin" icon={<MdDashboard />}>Dashboard</SidebarLink>
        <SidebarLink href="/dashboard/admin/orders" icon={<FaBagShopping />}>Orders</SidebarLink>
        <SidebarLink href="/dashboard/admin/products" icon={<FaTable />}>Products</SidebarLink>
        <SidebarLink href="/dashboard/admin/categories" icon={<MdCategory />}>Categories</SidebarLink>
        <SidebarLink href="/dashboard/admin/users" icon={<FaRegUser />}>Users</SidebarLink>
        <SidebarLink href="/dashboard/admin/settings" icon={<FaGear />}>Settings</SidebarLink>
      </nav>
    </aside>
  );
};

const SidebarLink = ({ href, icon, children }: any) => (
  <Link href={href} className="flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors">
    <span className="text-xl">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default DashboardSidebar;
