import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube",
  description: "Youtube Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-200">
        <div className="flex flex-col h-screen w-screen gap-1">
          <Navbar />
            <div className="flex flex-1 gap-20">
              <Sidebar/>
              <div >{children}</div>
            </div>
        </div>
        </body>
    </html>
  );
}
