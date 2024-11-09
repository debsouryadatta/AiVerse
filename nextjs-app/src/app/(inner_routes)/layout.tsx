import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/common/Providers";
import { NavbarComp } from "@/components/common/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/common/Footer";
import { SideBar } from "@/components/common/SideBar";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseX",
  description: "CourseX - Unveil The Power of AI in Education.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SideBar>
        {/* <NavbarComp /> */}
        {children}
        <Footer />
      </SideBar>
    </div>
  );
}
