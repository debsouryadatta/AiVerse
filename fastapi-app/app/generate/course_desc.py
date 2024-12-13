import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.3-70b-versatile")

prompt6 = ChatPromptTemplate.from_template("""
    You are an AI capable of generating a course description.
    Please provide a good description for a course about {courseTitle}. The description should be exactly of 90 characters.
    Formatting Instructions: {format_instructions}
    """)

class CourseDescription(BaseModel):
    description: str = Field(description="The description of the course")

async def generate_course_description(course_title: str):
    output_parser = JsonOutputParser(pydantic_object=CourseDescription)
    chain = prompt6 | model | output_parser
    result = await chain.ainvoke({
        "courseTitle": course_title,
        "format_instructions": output_parser.get_format_instructions()
    })
    return result['description']