"use client";

import { Search } from "@/components/search/Search";

export default function page() {

  return (
    <div className="min-h-[75vh]">
      <div className="w-full text-white flex flex-col justify-center items-center">
        <img
          className="w-full h-[200px] object-cover"
          src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1723098788/projects/code-1839406_ial7zq.jpg"
          alt="/"
        />
        <Search />
      </div>
    </div>
  )
}
