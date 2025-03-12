from fastapi import FastAPI

app = FastAPI()

async def home():
    return {"message": "Welcome to the AI Interview Planner!"}
