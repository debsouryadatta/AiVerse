import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.1-70b-versatile")

prompt2 = ChatPromptTemplate.from_template("""
    Please create an easiest explanation of the topic {topic} in most simplified way, the explanation should be exactly around 50 words.
    """)

async def generate_subtopic_explanations(subtopics):
    subtopic_explanations = []
    output_parser = StrOutputParser()
    chain = prompt2 | model | output_parser
    for element in subtopics['subtopics']:
        res = await chain.ainvoke({"topic": element})
        subtopic_explanations.append(res)
    return subtopic_explanations