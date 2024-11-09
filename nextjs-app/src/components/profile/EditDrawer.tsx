"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import EditProfile from "./EditProfile";
import DeleteCourseList from "./DeleteCourseList";

export default function EditDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <button className="w-[50vw] block mx-auto rounded-full bg-gray-900 dark:bg-gray-300 hover:shadow-2xl dark:hover:shadow-gray-300/30 font-semibold text-white dark:text-gray-900 px-6 py-2">
          Edit Profile
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] dark:bg-zinc-900">
        <div className="overflow-y-scroll hide-scrollbar grid grid-cols-1 gap-8 p-8 sm:grid-cols-2">
          <div>
            <EditProfile />
          </div>
          <div>
            <DeleteCourseList />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
