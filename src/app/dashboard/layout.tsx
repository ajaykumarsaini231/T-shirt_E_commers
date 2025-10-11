// app/dashboard/layout.tsx

import { requireAdmin } from "@/utils/adminAuth";
import DashboardSidebar from "@/components/DashboardSidebar";

// This is a **Server Component** by default
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Step 1: Check admin authorization on the server
  await requireAdmin();

  // Step 2: Render the layout
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar is a client component */}
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
