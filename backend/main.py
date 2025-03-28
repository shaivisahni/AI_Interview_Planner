from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate_questions(request: Request):
    form_data = await request.json()

    llm_prompt = f"""
    Generate exactly {form_data['num_questions']} interview questions for the following position at {form_data['company']}:

    Job Title: {form_data['job_title']}
    Job Description:
    {form_data['job_description']}

    The questions should be generated based on the following guidelines:
    1. DO NOT include any introductory text, explanations, or extra information. like this 
    "Here are three interview questions for the MicroLED Display Product Engineer position at Google:"
    2. No dashes or numbering
    3. DO NOT have any labels like "behavioral" or "static." 
    4. ONLY return the questions, plain and simple—without any introductory sentences like "Here are the questions."
    5. For static questions: A static question is related to logistical and practical aspects of the job, such as location, work schedule, legal eligibility, etc. So when asked about adding a Static Question, make sure it follows that criteria based on the description.
    6. For behavioral questions:, ask about the candidate’s previous experiences and actions in past jobs.
    7. If both is selected, generate a mixture of static and behavioral questions, but **do not label them** as static or behavioral.

    
    ONLY the questions should be returned, in a simple, clean list.
    """

    response = ollama.generate(
        model="llama3",
        prompt=llm_prompt,
        options={'temperature': 0.7}
    )

    questions = [q.strip() for q in response['response'].strip().split("\n") if q.strip()]

    return {"questions": questions}
