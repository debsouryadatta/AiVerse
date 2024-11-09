import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  //   modelName: "mixtral-8x7b-32768",
  // modelName: "llama-3.1-8b-instant",
  modelName: "llama-3.1-70b-versatile",
});

const prompt1 = ChatPromptTemplate.fromTemplate(`
    Please create an array of 3 subtopics which covers the whole topic {chapter}.
    Formatting Instructions: {format_instructions}
    `);

const prompt2 = ChatPromptTemplate.fromTemplate(`
    Please create an easiest explanation of the topic {topic} in most simplified way, the explanation should be exactly around 50 words.
    `);

const prompt3 = ChatPromptTemplate.fromTemplate(`
    Please provide a detailed youtube search query for the topic {topic} that can be used to find an informative educational video. The query should give an educational informative course in youtube. The provided response should only contain a single search query and should not contain any other information.
    `);

const prompt4 = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of summarising a youtube transcript, summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about. Here is the transcript: {transcript}. In the result, directly start with the summary, please do not include any other reference or any information.
    Formatting Instructions: {format_instructions}
    `);

const prompt5 = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of finding the most relevant image for a course.
    Please provide a good image search term for the title of a course about {courseTitle}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results. The search term should be a single word which fits best for the course title.
    Formatting Instructions: {format_instructions}
    `);

const prompt6 = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of generating a course description.
    Please provide a good description for a course about {courseTitle}. The description should be exactly of 90 characters.
    Formatting Instructions: {format_instructions}
    `);

const prompt7 = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of generating multiple choice question(mcq) using the given subtopic content. Please provide a single mcq question with 4 options and the correct answer. The question should be based on the subtopic content - {subtopicExplanation} and should be the most important question from the content given.
    Please provide the question, an array of answers and the correct answer in the format mentioned in the formatting instructions, please don't include any other starting reference or any other information.
    Formatting Instructions: {format_instructions}
  `);


async function generateSubtopics(chapter: string) {
  const outoutParser = StructuredOutputParser.fromZodSchema(
    z.object({
      subtopics: z
        .array(z.string())
        .describe("The explanation of each subtopic"),
    })
  );

  // Create the chain
  const chain = prompt1.pipe(model).pipe(outoutParser);

  return await chain.invoke({
    chapter: chapter,
    format_instructions: outoutParser.getFormatInstructions(),
  });
}

async function generateSubtopicExplanations(subtopics: {
  subtopics: string[];
}) {
  const subtopicExplanations = [];
  const outoutParser2 = new StringOutputParser();

  const chain2 = prompt2.pipe(model).pipe(outoutParser2);

  for (const element of subtopics.subtopics) {
    const res = await chain2.invoke({
      topic: element,
    });
    subtopicExplanations.push(res);
  }

  return subtopicExplanations;
}

async function generateYoutubeQuery(chapter: string) {
  const outoutParser3 = new StringOutputParser();

  const chain3 = prompt3.pipe(model).pipe(outoutParser3);

  const res = await chain3.invoke({
    topic: chapter,
  });

  return res;
}

async function getYoutubeVideoId(youtubeQuery: string) {
  let searchQuery = encodeURIComponent(youtubeQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("youtube fail");
    return null;
  }
  return data.items[0].id.videoId;
}

async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      //   @ts-ignore
      country: "EN",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

async function generateTranscriptSummary(transcript: string) {
  const outoutParser4 = StructuredOutputParser.fromZodSchema(
    z.object({
      summary: z.string().describe("The summary of the transcript"),
    })
  );

  const chain4 = prompt4.pipe(model).pipe(outoutParser4);

  const res = await chain4.invoke({
    transcript: transcript,
    format_instructions: outoutParser4.getFormatInstructions(),
  });

  return res.summary;
}

async function generateYoutube(chapter: string) {
  let youtubeQuery = await generateYoutubeQuery(chapter);
  console.log("youtubeQuery: ", youtubeQuery);
  let youtubeVideoId = await getYoutubeVideoId(youtubeQuery);
  console.log("youtubeVideoId: ", youtubeVideoId);
  let transcript = await getTranscript(youtubeVideoId);
  let transcriptSummary = await generateTranscriptSummary(transcript);
  return { youtubeQuery, youtubeVideoId, transcript, transcriptSummary };
}

export async function generateChapter(chapter: string) {
  let subtopics = await generateSubtopics(chapter);
  let subtopicExplanations = await generateSubtopicExplanations(subtopics);
  let youtube = await generateYoutube(chapter);

  return {
    title: chapter,
    subtopics: subtopics.subtopics,
    subtopicExplanations: subtopicExplanations,
    youtubeSearchQuery: youtube.youtubeQuery,
    videoId: youtube.youtubeVideoId,
    summary: youtube.transcriptSummary,
  };
}








// For Image
async function generateImageSearchTerm(courseTitle: string) {
  const outoutParser5 = StructuredOutputParser.fromZodSchema(
    z.object({
      imageSearchTerm: z.string().describe("Single search term for the image"),
    })
  );

  const chain5 = prompt5.pipe(model).pipe(outoutParser5);

  const res = await chain5.invoke({
    courseTitle: courseTitle,
    format_instructions: outoutParser5.getFormatInstructions(),
  });

  return res.imageSearchTerm;
}

async function getUnsplashImage(query: string) {
  const { data } = await axios.get(`
    https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_API_KEY}&w=1080&h=600
    `);
  return data.results[0].urls.small_s3;
}

export async function generateCourseImage(courseTitle: string) {
  let imageSearchTerm = await generateImageSearchTerm(courseTitle);
  console.log("imageSearchTerm: ", imageSearchTerm);
  let imageUrl = await getUnsplashImage(imageSearchTerm);
  return imageUrl;
}





// For Description
export async function generateCourseDescription(courseTitle: string) {
  const outoutParser6 = StructuredOutputParser.fromZodSchema(
    z.object({
      description: z.string().describe("The description of the course"),
    })
  );

  const chain6 = prompt6.pipe(model).pipe(outoutParser6);

  const res = await chain6.invoke({
    courseTitle: courseTitle,
    format_instructions: outoutParser6.getFormatInstructions(),
  });  

  return res.description;
}







// For Multiple Choice Questions
export async function generateMultipleChoiceQuestions(chapters: any) {
  const outoutParser7 = StructuredOutputParser.fromZodSchema(
    z.object({
      mcq: z.object({
        questionId: z.number().describe("The ID of the question"),
        question: z.string().describe("The question of the mcq"),
        options: z.array(z.string()).describe("An array of options of the mcq"),
        answer: z.string().describe("Just the answer of the mcq"),
      }),
    })
  );

  let mcqs = [];
  let questionIdCounter = 1;
  for(const chapter of chapters){
    let chapterMcqs = [];
    for(const subtopicExplanation of chapter.subtopicExplanations){
      const chain7 = prompt7.pipe(model).pipe(outoutParser7);
      const res = await chain7.invoke({
        subtopicExplanation: subtopicExplanation,
        format_instructions: outoutParser7.getFormatInstructions(),
      });

      // Add questionId to each mcq
      res.mcq.questionId = questionIdCounter++;
      chapterMcqs.push(res.mcq);
    }
    mcqs.push(chapterMcqs);
  }
  return mcqs;
}







// For generating a roadmap which includes the topics and subtopics related to the roadmap title
export async function generateRoadmap(roadmapTitle: string) {
  const outoutParser8 = StructuredOutputParser.fromZodSchema(
    z.object({
        title: z.string().describe("The title of the roadmap"),
        topics: z.array(
          z.object({
            title: z.string().describe("The title of the topic"),
            subtopics: z.array(z.string()).describe("The subtopics of the topic"),
          })
        ),
    })
  );

  const prompt8 = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of generating a roadmap for the roadmap title {roadmapTitle}.
    Please provide a perfect industry standard up to date roadmap for the given roadmap title. The roadmap should contain the topics and subtopics related to the roadmap title. The roadmap should be in the format mentioned in the formatting instructions.
    Formatting Instructions: {format_instructions}
    `);

  const chain8 = prompt8.pipe(model).pipe(outoutParser8);

  const res = await chain8.invoke({
    roadmapTitle: roadmapTitle,
    format_instructions: outoutParser8.getFormatInstructions(),
  });

  console.log("res: ", res);
  return res;
}

generateRoadmap("Artificial Intelligence");