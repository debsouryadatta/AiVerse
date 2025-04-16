"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { children: React.ReactNode }) => {
  const { open } = useSidebar();
  return (
    <>
      <DesktopSidebar {...props}>
        <div
          className={cn(
            "flex flex-col h-full",
            open ? "p-2" : "p-0 -mt-6"
          )}
        >
          {children}
        </div>
      </DesktopSidebar>
      <MobileSidebar {...props}>
        <div
          className={cn(
            "flex flex-col h-full",
            open ? "p-2" : "p-0 pt-1"
          )}
        >
          {children}
        </div>
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-full px-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 relative transition-all duration-300 border-r border-gray-200 dark:border-neutral-800 shadow-sm",
          open ? "py-4 w-[250px]" : "pt-2 pb-0 w-[70px]",
          className
        )}
        {...props}
      >
        <div className={cn(
          "cursor-pointer z-10 rounded-full p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all",
          open ? "absolute top-[26px] right-4" : "flex justify-center w-full mb-0 mt-4"
        )}>
          {open ? (
            <IconMenu2
              className="text-neutral-600 dark:text-neutral-300" 
              onClick={() => setOpen(false)} 
              size={18}
              stroke={2}
            />
          ) : (
            <IconMenu2 
              className="text-neutral-600 dark:text-neutral-300" 
              onClick={() => setOpen(true)} 
              size={18}
              stroke={2}
            />
          )}
        </div>
        {children}
      </div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              <div className="flex flex-col h-full">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  setOpen,
  className,
  ...props
}: {
  link: Links;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <>
      {link.href === "/signIn" || link.href === "/signOut" ? (
        <button
          onClick={async () => {
            if (link.href === "/signIn") {
              await signIn("google");
            } else if (link.href === "/signOut") {
              toast.success("Sign out successful");
              await new Promise(resolve => setTimeout(resolve, 1000));
              await signOut();
            }
          }}
          className={cn(
            "flex items-center justify-start gap-3 py-2.5 px-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-neutral-800",
            className
          )}
          {...props}
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            {link.icon}
          </div>

          {open && (
            <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium whitespace-pre inline-block !p-0 !m-0">
              {link.label}
            </span>
          )}
        </button>
      ) : (
        <Link
          onClick={() => setOpen && setOpen(false)}
          href={link.href}
          className={cn(
            "flex items-center justify-start gap-3 py-2.5 px-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-neutral-800",
            className
          )}
          {...props}
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            {link.icon}
          </div>

          {open && (
            <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium whitespace-pre inline-block !p-0 !m-0">
              {link.label}
            </span>
          )}
        </Link>
      )}
    </>
  );
};
