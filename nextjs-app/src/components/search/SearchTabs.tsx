"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchResults from "./SearchResults";
import { CourseWithUser, User } from "@/types";

export default function SearchTabs({courses, profiles}: {courses: CourseWithUser[], profiles: User[]}) {
  return (
    <div className="mt-10 w-[300px] sm:w-[600px] lg:w-[900px]">
      <Tabs defaultValue="account" className="w-[300px] sm:w-[600px] lg:w-[900px]">
        <TabsList>
          <TabsTrigger value="account">Courses</TabsTrigger>
          <TabsTrigger value="password">Profiles</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <SearchResults courses={courses} />
        </TabsContent>
        <TabsContent value="password">
        <SearchResults profiles={profiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
