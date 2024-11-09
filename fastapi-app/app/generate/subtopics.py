import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.1-70b-versatile")

prompt1 = ChatPromptTemplate.from_template("""
    Please create an array of 3 subtopics which covers the whole topic {chapter}.
    Formatting Instructions: {format_instructions}
    """)

class Subtopics(BaseModel):
    subtopics: list[str] = Field(description="The explanation of each subtopic")


async def generate_subtopics(chapter: str):
    output_parser = JsonOutputParser(pydantic_object=Subtopics)
    chain = prompt1 | model | output_parser
    return await chain.ainvoke({
        "chapter": chapter,
        "format_instructions": output_parser.get_format_instructions()
    })
    