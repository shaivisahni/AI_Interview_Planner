from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500/"],  # Allow frontend URL during development
    allow_methods=["POST"],
    allow_headers=["Content-Type"]
)

MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
API_KEY = os.getenv("HUGGINGFACE_API_KEY")

async def generate_response(prompt: str):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {"inputs": prompt}

    async with httpx.AsyncClient() as client:
        response = await client.post(MODEL_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to get a response from the model.")

@app.post("/generate")
async def generate(request: Request):
    data = await request.json()
    prompt = data.get("prompt")

    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is missing.")

    result = await generate_response(prompt)
    return {"response": result}