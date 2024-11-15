"use client";

import CreatePost from '@/components/create/CreatePost';
import { GenerateCourse } from '@/components/create/GenerateCourse'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function page() {
  const session = useSession();
  const router = useRouter();

  if (!session?.data?.user) {
    toast("You need to be logged in to create a course.");
    return router.push('/gallery');
  }

  return (
    <div className='mt-10 mb-20 min-h-[75vh] flex justify-center items-center'>
      <Tabs defaultValue="post" className="flex flex-col items-center justify-center">
        <TabsList className="bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white w-96">
          <TabsTrigger className='w-48' value="post">Create Post</TabsTrigger>
          <TabsTrigger className='w-48' value="course">Generate Course</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <CreatePost />
        </TabsContent>
        <TabsContent value="course">
          <GenerateCourse />
        </TabsContent>
      </Tabs>
    </div>
  )
}
