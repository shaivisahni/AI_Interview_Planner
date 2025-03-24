from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
API_KEY = os.getenv("API_KEY") 

def generate_response(prompt: str):
    headers = {"Authorization": f"Bearer {API_KEY}"}  
    payload = {"inputs": prompt}  

    response = requests.post(MODEL_URL, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        
        if isinstance(data, list) and "generated_text" in data[0]:  
            questions = data[0]["generated_text"].strip().split("\n") 
            return {"response": questions}

@app.get("/generate")
async def generate(prompt: str):
    return generate_response(prompt) 



@app.get("/")
async def home():
    return {"message": "Welcome to the AI Interview Planner!"}
