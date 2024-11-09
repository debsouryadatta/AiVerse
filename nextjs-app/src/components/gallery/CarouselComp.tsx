"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function CarouselComp() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Featured Courses
      </h2>
      <Carousel items={cards} />
    </div>
  );
}



const data = [
  {
    id: "clxus2fmt0004msfzryl8gvhg",
    category: "",
    title: "Blockchain Development",
    src: "https://images.unsplash.com/photo-1642751227520-32ec1a7a4b11?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "clxwv5c1o0001hl5ndl6nwzo6",
    category: "",
    title: "Data Structures and Algorithms",
    src: "https://plus.unsplash.com/premium_photo-1681810994162-43dbe0919d3f?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "clz2ab55j0001sty0oajgbkmb",
    category: "",
    title: "Machine Learning",
    src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    id: "clz1dzkdi00013rm8j79aac34",
    category: "",
    title: "Data Analysis",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
