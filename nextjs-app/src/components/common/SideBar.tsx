"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBookmark,
  IconBrandGoogleFilled,
  IconBrandTabler,
  IconLayoutGrid,
  IconSearch,
  IconSettings,
  IconSitemap,
  IconSquareRoundedPlus,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";

export function SideBar({children}: Readonly<{children: React.ReactNode;}>) {
  const session = useSession();

  const signedInLinks = [
    {
      label: "Explore",
      href: "/explore",
      icon: (
        <IconLayoutGrid className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Create",
      href: "/create",
      icon: (
        <IconSquareRoundedPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ai Tools",
      href: "/aitools",
      icon: (
        <IconSitemap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: (
        <IconBookmark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: `/profile/${session?.data?.user?.id!}`,
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "SignOut",
      href: "/signOut",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const signedOutLinks = [
    {
      label: "Explore",
      href: "/explore",
      icon: (
        <IconLayoutGrid className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Create",
      href: "/create",
      icon: (
        <IconSquareRoundedPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ai Tools",
      href: "/aitools",
      icon: (
        <IconSitemap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "SignIn",
      href: "/signIn",
      icon: (
        <IconBrandGoogleFilled className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  let links = [];
  if(session?.data?.user){
    links = signedInLinks;
  } else {
    links = signedOutLinks;
  }

  

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      {session?.data?.user && (
        <div className="absolute top-4 right-6 z-50">
          <CreditsDisplay />
        </div>
      )}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} setOpen={setOpen} className="hover:bg-gray-300 dark:hover:bg-neutral-900 rounded-lg px-1" />
              ))}
            </div>
          </div>
          <div>
          <div className="ml-[-7px] mb-4 flex items-center">
            <ThemeToggle />
            {open && (
              <motion.div 
                className="ml-1 text-[15px] text-neutral-700 dark:text-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }} // Adjust the duration as needed
              >
                Themes
              </motion.div>
            )}
          </div>
            {session?.data?.user && (
              <SidebarLink
                link={{
                  label: `${session?.data?.user?.name}`,
                  href: "#",
                  icon: (
                    <Image
                      src={session?.data?.user?.image!}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      {/* <Dashboard /> */}
      <div className="w-full overflow-y-scroll bg-gray-200 dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link
      href="/explore"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        CourseX
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  const { theme } = useTheme();
  return (
    <Link
      href="/gallery"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
