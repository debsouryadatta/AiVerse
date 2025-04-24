import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from app.lib.fetch_transcript import fetch_transcript
import requests
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.3-70b-versatile")

prompt3 = ChatPromptTemplate.from_template("""
    Please provide a detailed youtube search query for the topic {topic} that can be used to find an informative educational video. The query should give an educational informative course in youtube. The provided response should only contain a single search query and should not contain any other information.
    """)

prompt4 = ChatPromptTemplate.from_template("""
    You are an AI capable of summarising a youtube transcript, summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about. Here is the transcript: {transcript}. In the result, directly start with the summary, please do not include any other reference or any information.
    Formatting Instructions: {format_instructions}
    """)

class TranscriptSummary(BaseModel):
    summary: str = Field(description="The summary of the transcript")


async def generate_youtube_query(chapter: str):
    output_parser = StrOutputParser()
    chain = prompt3 | model | output_parser
    return await chain.ainvoke({"topic": chapter})


async def get_youtube_video_id(youtube_query: str):
    search_query = requests.utils.quote(youtube_query)
    url = f"https://www.googleapis.com/youtube/v3/search?key={os.getenv('YOUTUBE_API_KEY')}&q={search_query}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5"
    response = requests.get(url)
    data = response.json()
    if not data or 'items' not in data or len(data['items']) == 0:
        print("YouTube API request failed")
        return None
    return data['items'][0]['id']['videoId']

async def get_transcript(video_id: str):
    try:
        transcript = fetch_transcript(video_id)
        return transcript
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return ""

async def generate_transcript_summary(transcript: str):
    output_parser = JsonOutputParser(pydantic_object=TranscriptSummary)
    chain = prompt4 | model | output_parser
    result = await chain.ainvoke({
        "transcript": transcript,
        "format_instructions": output_parser.get_format_instructions()
    })
    return result['summary']

async def generate_youtube(chapter: str):
    youtube_query = await generate_youtube_query(chapter)
    print("youtubeQuery: ", youtube_query)
    youtube_video_id = await get_youtube_video_id(youtube_query)
    print("youtubeVideoId: ", youtube_video_id)
    transcript = await get_transcript(youtube_video_id)
    transcript_summary = await generate_transcript_summary(transcript)
    return {
        "youtubeQuery": youtube_query,
        "youtubeVideoId": youtube_video_id,
        "transcript": transcript,
        "transcriptSummary": transcript_summary
    }