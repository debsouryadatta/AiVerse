import os
from typing import List
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.1-70b-versatile")

prompt7 = ChatPromptTemplate.from_template("""
    You are an AI capable of generating multiple choice question(mcq) using the given subtopic content. Please provide a single mcq question with 4 options and the correct answer. The question should be based on the subtopic content - {subtopicExplanation} and should be the most important question from the content given.
    Please provide the question, an array of answers and the correct answer in the format mentioned in the formatting instructions, please don't include any other starting reference or any other information.
    Formatting Instructions: {format_instructions}
    """)

class MCQ(BaseModel):
    questionId: int = Field(description="The ID of the question")
    question: str = Field(description="The question of the mcq")
    options: List[str] = Field(description="An array of options of the mcq")
    answer: str = Field(description="Just the answer of the mcq")

async def generate_mcq(chapters):
    print("chapters: ", chapters)
    output_parser = JsonOutputParser(pydantic_object=MCQ)
    mcqs = []
    question_id_counter = 1
    for chapter in chapters:
        chapter_mcqs = []
        for subtopic_explanation in chapter['subtopicExplanations']:
            chain = prompt7 | model | output_parser
            res = await chain.ainvoke({
                "subtopicExplanation": subtopic_explanation,
                "format_instructions": output_parser.get_format_instructions()
            })

            res['questionId'] = question_id_counter
            question_id_counter += 1
            chapter_mcqs.append(res)

        mcqs.append(chapter_mcqs)
    print("mcqs: ", mcqs)
    return mcqs