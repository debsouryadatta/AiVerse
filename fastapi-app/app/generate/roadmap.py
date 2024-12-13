import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.3-70b-versatile")

class Topic(BaseModel):
    title: str = Field(description="The title of the topic")
    subtopics: List[str] = Field(description="The subtopics of the topic")

class Roadmap(BaseModel):
    title: str = Field(description="The title of the roadmap")
    topics: List[Topic] = Field(description="The topics and subtopics of the roadmap")

async def generate_roadmap(roadmap_title: str):
    output_parser = JsonOutputParser(pydantic_object=Roadmap)

    prompt = ChatPromptTemplate.from_template("""
    You are an AI capable of generating a roadmap for the roadmap title {roadmap_title}.
    Please provide a perfect industry standard up to date roadmap for the given roadmap title. The roadmap should contain the topics and subtopics related to the roadmap title. The roadmap should be in the format mentioned in the formatting instructions.
    Formatting Instructions: {format_instructions}
    """)

    chain = prompt | model | output_parser

    res = await chain.ainvoke({
        "roadmap_title": roadmap_title,
        "format_instructions": output_parser.get_format_instructions(),
    })

    print("res: ", res)
    return res