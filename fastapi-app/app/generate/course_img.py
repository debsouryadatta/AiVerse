import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
import requests
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.1-70b-versatile")

prompt5 = ChatPromptTemplate.from_template("""
    You are an AI capable of finding the most relevant image for a course.
    Please provide a good image search term for the title of a course about {courseTitle}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results. The search term should be a single word which fits best for the course title.
    Formatting Instructions: {format_instructions}
    """)

class ImageSearchTerm(BaseModel):
    imageSearchTerm: str = Field(description="Single search term for the image")

async def generate_image_search_term(course_title: str):
    output_parser = JsonOutputParser(pydantic_object=ImageSearchTerm)
    chain = prompt5 | model | output_parser
    result = await chain.ainvoke({
        "courseTitle": course_title,
        "format_instructions": output_parser.get_format_instructions()
    })
    return result['imageSearchTerm']

async def get_unsplash_image(query: str):
    url = f"https://api.unsplash.com/search/photos?per_page=1&query={query}&client_id={os.getenv('UNSPLASH_API_KEY')}&w=1080&h=600"
    response = requests.get(url)
    data = response.json()
    return data['results'][0]['urls']['small_s3']

async def generate_course_image(course_title: str):
    image_search_term = await generate_image_search_term(course_title)
    print("imageSearchTerm: ", image_search_term)
    image_url = await get_unsplash_image(image_search_term)
    return image_url