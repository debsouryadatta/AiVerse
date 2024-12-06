import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import UploadFile
import aiohttp
from typing import List, Dict
import traceback

load_dotenv()

model = ChatGroq(groq_api_key=os.environ["GROQ_API_KEY"], model_name="llama-3.1-70b-versatile")

async def transcribe_audio(audio_file: UploadFile) -> str:
    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    
    # Read the file content
    file_content = await audio_file.read()
    
    # Prepare the form data
    form_data = aiohttp.FormData()
    form_data.add_field('file', file_content, filename=audio_file.filename)
    form_data.add_field('model', 'whisper-large-v3-turbo')
    form_data.add_field('temperature', '0')
    form_data.add_field('response_format', 'json')
    form_data.add_field('language', 'en')
    
    headers = {
        'Authorization': f'Bearer {os.environ["GROQ_API_KEY"]}'
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=form_data, headers=headers) as response:
            if response.status != 200:
                raise Exception(f"Error: {response.status}")
            
            data = await response.json()
            return data.get('text', 'Transcription failed or no text returned.')

async def get_voice_chat_response(audio: UploadFile, messages: List[Dict], voice_mentor_description: str):
    try:
        # First transcribe the audio
        input_text = await transcribe_audio(audio)
        print(f"Input text from voice_chat.py: {input_text}")
        
        # Convert messages to the format expected by LangChain
        converted_messages = []
        for msg in messages:
            converted_messages.extend([
                HumanMessage(content=msg["sender"]),
                AIMessage(content=msg["response"])
            ])
        print(f"Messages from voice_chat.py: {converted_messages}")
        
        output_parser = StrOutputParser()
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
            You are an AI capable of generating a voice chat response for the given messages and voice mentor details - {voice_mentor_description}. Please provide a perfect voice chat response for the given messages and voice mentor details with only english language. 
            
            Please provide the response in a nice way containing commas and other sysbols since it is a voice chat response and we have a Text To Speech model on the other end. Don't include giving '**' for bold purposes, rather use commas, exclamations and other symbols.
            """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}")
        ])
        
        chain = prompt | model | output_parser
        
        response = await chain.ainvoke({
            "voice_mentor_description": voice_mentor_description,
            "chat_history": converted_messages,
            "input": input_text
        })
        
        return {"response": response, "input": input_text}
    except Exception as e:
        print(f"Traceback error: {traceback.format_exc()}")
        return {"error": str(e)}