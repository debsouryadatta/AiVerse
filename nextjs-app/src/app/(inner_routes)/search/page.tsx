"use client";

import { Search } from "@/components/search/Search";
import Image from "next/image";

export default function page() {

  return (
    <div className="min-h-[75vh]">
      <div className="w-full text-white flex flex-col justify-center items-center">
        <Image
          className="w-full h-[200px] object-cover"
          src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1723098788/projects/code-1839406_ial7zq.jpg"
          alt="/"
          width={200}
          
        />
        <Search />
      </div>
    </div>
  )
}
