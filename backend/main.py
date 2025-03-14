from fastapi import FastAPI
import requests
from transformers import AutoModelForCausalLM, AutoTokenizer
from fastapi.responses import JSONResponse

app = FastAPI()

MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
API_KEY = "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"  

def generate_response(prompt: str):
    headers = {"Authorization": f"Bearer {API_KEY}"}  
    payload = {"inputs": prompt}  

    response = requests.post(MODEL_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Request failed with status code {response.status_code}"}

@app.get("/generate")
async def generate(prompt: str):
    result = generate_response(prompt) 
    return {"response": result}  

@app.get("/")
async def home():
    return {"message": "Welcome to the AI Interview Planner!"}
