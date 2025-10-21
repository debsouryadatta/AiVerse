import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import { Question } from "@/types/games";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  modelName: "openai/gpt-oss-120b",
});

// ============================================================================
// OPTIMIZED SINGLE LLM CALL ARCHITECTURE
// ============================================================================

/**
 * Single comprehensive LLM call that generates all chapter content at once:
 * - Subtopics
 * - Explanations
 * - YouTube search query
 * - Course description
 * - Image search term
 * - MCQs
 * 
 * Now with full course context (all chapters) for better coherence
 */
async function generateAllChapterContent(
  chapterTitle: string,
  courseTitle: string,
  allChapters: { id: number; title: string }[]
) {
  const comprehensiveOutputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      subtopics: z
        .array(z.string())
        .describe("Array of 3 main subtopics that cover the chapter"),
      subtopicExplanations: z
        .array(z.string())
        .describe("Array of simplified 50-word explanations for each subtopic"),
      youtubeSearchQuery: z
        .string()
        .describe("Detailed YouTube search query for an educational video on this topic"),
      courseDescription: z
        .string()
        .describe("Exactly 90 character description of the course"),
      imageSearchTerm: z
        .string()
        .describe("Single word search term for Unsplash image for this course"),
      mcqs: z
        .array(
          z.object({
            questionId: z.number().describe("Sequential ID for the question"),
            question: z.string().describe("The MCQ question"),
            options: z.array(z.string()).describe("4 options for the MCQ"),
            answer: z.string().describe("The correct answer"),
          })
        )
        .describe("Array of MCQs based on the subtopics (one per subtopic)"),
    })
  );

  const chaptersContext = allChapters
    .map((ch, idx) => `${idx + 1}. ${ch.title}`)
    .join("\n  ");

  const comprehensivePrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert AI educator and course designer. Generate comprehensive educational content for a course in a single response.
    
    Course Title: {courseTitle}
    All Chapters in This Course:
    {chaptersContext}
    
    Current Chapter to Generate: {chapterTitle}
    
    Please generate content for the current chapter that:
    1. Is coherent with the overall course progression
    2. Doesn't duplicate content from other chapters
    3. Complements and builds upon other chapters logically
    
    Please provide:
    1. 3 subtopics that comprehensively cover the chapter (unique and distinct from other chapters)
    2. Simplified 50-word explanations for each subtopic (exactly around 50 words each)
    3. A detailed YouTube search query that will find an informative educational video
    4. A course description (exactly 90 characters) that describes the whole course
    5. A single-word Unsplash search term for a course image
    6. An MCQ question for each subtopic with 4 options and the correct answer
    
    Formatting Instructions: {format_instructions}
  `);

  const chain = comprehensivePrompt
    .pipe(model)
    .pipe(comprehensiveOutputParser);

  const res = await chain.invoke({
    courseTitle: courseTitle,
    chaptersContext: chaptersContext,
    chapterTitle: chapterTitle,
    format_instructions: comprehensiveOutputParser.getFormatInstructions(),
  });

  return res;
}

/**
 * Optimized function that generates everything in one LLM call, then fetches external APIs
 * Now with full course context for better coherence
 */
export async function generateChapterOptimized(
  chapterTitle: string,
  courseTitle: string = "",
  allChapters: { id: number; title: string }[] = []
) {
  // Single LLM call for all content with course context
  const allContent = await generateAllChapterContent(
    chapterTitle,
    courseTitle,
    allChapters.length > 0 ? allChapters : [{ id: 1, title: chapterTitle }]
  );

  // Fetch external APIs in parallel
  const [youtubeVideoId, unsplashImage] = await Promise.all([
    getYoutubeVideoId(allContent.youtubeSearchQuery),
    courseTitle ? getUnsplashImage(allContent.imageSearchTerm) : Promise.resolve(null),
  ]);

  // Get transcript and summary if video found
  let transcriptSummary = "";
  if (youtubeVideoId) {
    const transcript = await getTranscript(youtubeVideoId);
    if (transcript) {
      transcriptSummary = await generateTranscriptSummary(transcript);
    }
  }

  return {
    title: chapterTitle,
    subtopics: allContent.subtopics,
    subtopicExplanations: allContent.subtopicExplanations,
    youtubeSearchQuery: allContent.youtubeSearchQuery,
    videoId: youtubeVideoId || "",
    summary: transcriptSummary,
    description: allContent.courseDescription,
    imageSearchTerm: allContent.imageSearchTerm,
    imageUrl: unsplashImage,
    mcqs: allContent.mcqs,
  };
}

/**
 * Wrapper function for generating multiple chapters optimized
 * Passes full chapters context to each chapter for better coherence
 */
export async function generateChaptersOptimized(
  chapters: { id: number; title: string }[],
  courseTitle: string
) {
  const generatedChapters = [];
  try {
    for (const chapter of chapters) {
      // Pass the entire chapters array as context so LLM knows the course structure
      const res = await generateChapterOptimized(
        chapter.title,
        courseTitle,
        chapters // Pass all chapters for context
      );
      generatedChapters.push(res);
    }
    console.log("Generated Chapters (Optimized)", generatedChapters);
    return generatedChapters;
  } catch (error) {
    console.log("Error generating chapters", error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS - Used by optimized architecture
// ============================================================================

/**
 * Fetch YouTube video ID from search query
 */
async function getYoutubeVideoId(youtubeQuery: string) {
  let searchQuery = encodeURIComponent(youtubeQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  if (!data || data.items[0] === undefined) {
    console.log("YouTube video not found");
    return null;
  }
  return data.items[0].id.videoId;
}

/**
 * Fetch YouTube transcript for a video
 */
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

/**
 * Generate summary from YouTube transcript
 */
async function generateTranscriptSummary(transcript: string) {
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of summarising a youtube transcript, summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about. Here is the transcript: {transcript}. In the result, directly start with the summary, please do not include any other reference or any information.
    Formatting Instructions: {format_instructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      summary: z.string().describe("The summary of the transcript"),
    })
  );

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    transcript: transcript,
    format_instructions: outputParser.getFormatInstructions(),
  });

  return res.summary;
}

/**
 * Fetch image from Unsplash API
 */
async function getUnsplashImage(query: string) {
  const { data } = await axios.get(`
    https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_API_KEY}&w=1080&h=600
  `);
  return data.results[0].urls.small_s3;
}

/**
 * Generate course description (independent call if needed)
 */
export async function generateCourseDescription(courseTitle: string) {
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of generating a course description.
    Please provide a good description for a course about {courseTitle}. The description should be exactly of 90 characters.
    Formatting Instructions: {format_instructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      description: z.string().describe("The description of the course"),
    })
  );

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    courseTitle: courseTitle,
    format_instructions: outputParser.getFormatInstructions(),
  });

  return res.description;
}

/**
 * Generate course image (independent call if needed)
 */
export async function generateCourseImage(courseTitle: string) {
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of finding the most relevant image for a course.
    Please provide a good image search term for the title of a course about {courseTitle}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results. The search term should be a single word which fits best for the course title.
    Formatting Instructions: {format_instructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      imageSearchTerm: z.string().describe("Single search term for the image"),
    })
  );

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    courseTitle: courseTitle,
    format_instructions: outputParser.getFormatInstructions(),
  });

  const imageSearchTerm = res.imageSearchTerm;
  console.log("imageSearchTerm: ", imageSearchTerm);
  const imageUrl = await getUnsplashImage(imageSearchTerm);
  return imageUrl;
}

// ============================================================================
// FEATURE FUNCTIONS - Roadmap & Voice Mentor
// ============================================================================

/**
 * Generate a learning roadmap with topics and subtopics
 */
export async function generateRoadmap(roadmapTitle: string) {
  const outputParser = StructuredOutputParser.fromZodSchema(
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

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI capable of generating a roadmap for the roadmap title {roadmapTitle}.
    Please provide a perfect industry standard up to date roadmap for the given roadmap title. The roadmap should contain the topics and subtopics related to the roadmap title. The roadmap should be in the format mentioned in the formatting instructions.
    Formatting Instructions: {format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    roadmapTitle: roadmapTitle,
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log("Generated roadmap: ", res);
  return res;
}

/**
 * Generate voice mentor response from audio input and chat history
 */
export async function getVoiceChatResponse(messages: any, audioInput: File, voiceMentorDescription: string) {
  console.log("Messages 1 from generate.ts: ", messages);

  const convertedMessages = messages.flatMap((message: any) => [
    new HumanMessage(message.sender),
    new AIMessage(message.response)
  ]);

  console.log("Messages 2 from generate.ts: ", convertedMessages);

  const outputParser = new StringOutputParser();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
      You are an AI capable of generating a voice chat response for the given messages and voice mentor details - {voiceMentorDescription}. Please provide a perfect voice chat response for the given messages and voice mentor details with only english language.
      
      Please provide the response in a nice way containing commas and other symbols since it is a voice chat response and we have a Text To Speech model on the other end. Don't include giving '**' for bold purposes, rather use commas, exclamations and other symbols.
    `],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(model).pipe(outputParser);

  const input = await transcribeAudio(audioInput);
  console.log("Input from generate.ts: ", input);

  const res = await chain.invoke({
    voiceMentorDescription: voiceMentorDescription,
    chat_history: convertedMessages,
    input: input,
  });

  console.log("Response from generate.ts: ", res);
  return { response: res, input: input };
}

/**
 * Transcribe audio using Groq's Whisper model
 */
async function transcribeAudio(file: File) {
  const url = "https://api.groq.com/openai/v1/audio/transcriptions";
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('temperature', '0');
  formData.append('response_format', 'json');
  formData.append('language', 'en');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text || 'Transcription failed or no text returned.';
}

// ============================================================================
// QUIZ GENERATION
// ============================================================================
export async function generateCourseQuiz(
  courseTitle: string,
  content: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<Question[]> {
  const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
  
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      questions: z
        .array(
          z.object({
            question: z.string().describe("The quiz question"),
            options: z.array(z.string()).describe("Array of 4 answer options"),
            correctAnswer: z.number().describe("Index of the correct answer (0-3)"),
            explanation: z.string().describe("Explanation of the correct answer"),
          })
        )
        .describe(`Array of ${count} quiz questions`),
    })
  );

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an expert quiz creator. Generate ${count} quiz questions about: {courseTitle}
    
    Course Content: {content}
    
    Create clear, educational quiz questions with 4 options each and include explanations.
    Difficulty level: {difficulty}
    
    Formatting Instructions: {format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    courseTitle: courseTitle,
    content: content,
    difficulty: difficulty,
    format_instructions: outputParser.getFormatInstructions(),
  });

  return res.questions;
}