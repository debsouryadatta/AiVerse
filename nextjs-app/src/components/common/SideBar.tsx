"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBookmark,
  IconBrandGoogleFilled,
  IconBrandTabler,
  IconLayoutGrid,
  IconRobot,
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
import { ThemeToggle } from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";
import { toast } from "sonner";

export function SideBar({children}: Readonly<{children: React.ReactNode;}>) {
  const session = useSession();
  const { theme, setTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      label: "AI Playground",
      href: "/aiplayground",
      icon: (
        <IconRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
  ];

  let links = [];
  if(session?.data?.user){
    links = signedInLinks;
  } else {
    links = signedOutLinks;
  }

  const [open, setOpen] = useState(false);

  // Check if the screen is larger than mobile on initial render and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        // 768px is the typical breakpoint for md screens in Tailwind
        setOpen(window.innerWidth >= 768);
      }
    };
    
    // Set initial state
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      {session?.data?.user && (
        <div className="absolute top-14 right-6 z-50 sm:top-4">
          <CreditsDisplay />
        </div>
      )}
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open && (
              <div className="mb-2 -ml-2 -mt-1">
                <Logo />
              </div>
            )}
            <div className={cn(
              "flex flex-col gap-1",
              !open && "mt-0"
            )}>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="" />
              ))}
            </div>
          </div>
          <div>
            <div className={cn(
              "flex items-center hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all py-2 cursor-pointer",
              open ? "pl-3" : "justify-center -ml-1"
            )}
            onClick={() => {
              if(theme === 'dark') {
                setTheme('light');
              } else {
                setTheme('dark');
              }
            }}
            >
              <ThemeToggle />
              {open && (
                <motion.div 
                  className="ml-2 text-[15px] text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Themes
                </motion.div>
              )}
            </div>
            {session?.data?.user ? (
              <div className="relative">
                <div 
                  className={cn(
                    "flex items-center gap-3 py-2.5 px-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer",
                    open ? "" : "justify-center"
                  )}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <Image
                    src={session?.data?.user?.image!}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                  {open && (
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium whitespace-pre inline-block !p-0 !m-0">
                      {session?.data?.user?.name}
                    </span>
                  )}
                </div>
                
                {showProfileMenu && open && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-neutral-800 rounded-md shadow-md overflow-hidden z-50"
                  >
                    <Link 
                      href={`/profile/${session?.data?.user?.id!}`}
                      className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Visit Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      onClick={async () => {
                        toast.success("Sign out successful");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div 
                className={cn(
                  "flex items-center gap-3 py-2.5 px-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer",
                  open ? "" : "justify-center"
                )}
                onClick={async () => {
                  await signIn("google");
                }}
              >
                <IconBrandGoogleFilled className={cn("text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0", open ? "" : "mb-2")} />
                {open && (
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium whitespace-pre inline-block !p-0 !m-0">
                    Sign In
                  </span>
                )}
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
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
      className="flex items-center px-2 py-2 transition-all rounded-md"
    >
      <div className="relative flex items-center">
        <Image
          src={"https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png"}
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full shadow-sm"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-semibold text-lg text-neutral-800 dark:text-white ml-3"
        >
          AiVerse
        </motion.span>
      </div>
    </Link>
  );
};

export const LogoIcon = () => {
  const { theme } = useTheme();
  return (
    <Link
      href="/explore"
      className="font-normal flex justify-center items-center text-sm text-black py-1"
    >
      <Image
        src={"https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png"}
        alt="Logo"
        width={32}
        height={32}
        className="rounded-full h-8 w-8"
      />
    </Link>
  );
};
