import { JsonValue } from "@prisma/client/runtime/library";

export interface Roadmap {
  title: string;
  topics: {
    title: string;
    subtopics: string[];
  }[];
}

export interface RoadmapModel {
  id: string;
  userId: string;
  title: string;
  roadmap: string | JsonValue | Roadmap;
  createdAt?: Date;
  updatedAt?: Date;
}