'use client'
import React from "react";
import Header from "@/components/dashboardLayout/header";
import Sidebar from "@/components/dashboardLayout/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className="flex h-screen border-collapse overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;