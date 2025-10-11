"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MdDashboard, MdCategory } from "react-icons/md";
import { FaBagShopping, FaRegUser, FaGear, FaTable, FaBars, } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-600 text-white w-64 flex flex-col z-40 transform transition-transform duration-300 ease-in-out
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } md:translate-x-0 md:static md:min-h-screen`}
      >
        <h2 className="text-2xl font-bold px-6 py-4 border-b border-blue-500">
          Admin Panel
        </h2>

        <nav className="flex-1 overflow-y-auto">
          <SidebarLink href="/dashboard/admin" icon={<MdDashboard />}>Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/admin/orders" icon={<FaBagShopping />}>Orders</SidebarLink>
          <SidebarLink href="/dashboard/admin/products" icon={<FaTable />}>Products</SidebarLink>
          <SidebarLink href="/dashboard/admin/categories" icon={<MdCategory />}>Categories</SidebarLink>
          <SidebarLink href="/dashboard/admin/users" icon={<FaRegUser />}>Users</SidebarLink>
          {/* <SidebarLink href="/dashboard/admin/settings" icon={<FaGear />}>Settings</SidebarLink> */}
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

const SidebarLink = ({ href, icon, children }: any) => (
  <Link href={href} className="flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors">
    <span className="text-xl">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default DashboardSidebar;
