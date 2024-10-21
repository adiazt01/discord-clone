import { NavigationSidebar } from "@/components/navigation/NavigationSidebar";
import React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex min-h-screen flex-row border border-red-500">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] flex flex-row w-full border border-green-500">
        {children}
      </main>
    </div>
  );
}
