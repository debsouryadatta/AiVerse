"use client";

import { InputBox } from '@/components/create/InputBox'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

export default function page() {
  const session = useSession();
  const router = useRouter();

  if (!session?.data?.user) {
    toast("You need to be logged in to create a course.");
    return router.push('/gallery');
  }

  return (
    <div className='mt-28 mb-20 min-h-[75vh]'>
      <InputBox />
    </div>
  )
}
