from contextlib import asynccontextmanager
import traceback
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.models.models import ChapterPayload
import json


# Creating a context manager so that we can connect to db & create tables before starting the app
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App starting")
    # create_table()
    # initialize_chatbot_resources()
    # print("Tables Created")
    yield


app = FastAPI(
    lifespan=lifespan,
    title="CourseX FastAPI",
    description="APIs for CourseX",
)

origins = [
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/generate/course/chapter/{chapter}")
async def generate_chapter(chapter: str):
    from app.generate.chapter import generate_chapter
    return await generate_chapter(chapter)

@app.get("/generate/course/image/{course_title}")
async def generate_course_image(course_title: str):
    from app.generate.course_img import generate_course_image
    return await generate_course_image(course_title)

@app.get("/generate/course/description/{course_title}")
async def generate_course_description(course_title: str):
    from app.generate.course_desc import generate_course_description
    return await generate_course_description(course_title)

@app.get("/generate/roadmap/{roadmap_title:path}")
async def generate_roadmap(roadmap_title: str):
    from app.generate.roadmap import generate_roadmap
    return await generate_roadmap(roadmap_title)

@app.post("/generate/course/chapter/mcq")
async def generate_mcq(chapters: ChapterPayload):
    from app.generate.mcq import generate_mcq
    return await generate_mcq(chapters.chapters)

@app.post("/get/voice_chat_response")
async def get_voice_chat_response(audio: UploadFile = File(...),messages: str = Form(...),voiceMentorDescription: str = Form(...)):
    from app.generate.voice_chat import get_voice_chat_response
    # Parse the JSON string of messages back to a list
    messages_list = json.loads(messages)
    return await get_voice_chat_response(audio, messages_list, voiceMentorDescription)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host = "0.0.0.0", port=8000, reload=True)