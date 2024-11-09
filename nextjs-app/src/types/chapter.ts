export interface Chapter {
  title: string;
  courseId: string;
  subtopics: string[]; // Assuming subtopics is an array of strings
  subtopicExplanations: string[]; // Assuming subtopicExplanations is an array of strings
  youtubeSearchQuery: string;
  videoId: string;
  summary: string;
}
