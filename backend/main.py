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
Generate an interview script for the following position:

Job Title: {form_data['job_title']}
Job Description:
{form_data['job_description']}

The interview should follow this structured format, ensuring a natural flow between different types of questions and messages. Use the example below as a reference and generate enough questions based on the job description.
NO "*" anywhere
---

Example Interview:

Send a welcome message  

Welcome! For this interview, I will need to chat with you for about 15 minutes. Afterwards, we will schedule a one-on-one call with you to talk more in person.

Ask a custom question  

First, could you please tell me why you are interested in joining Searchless?

Ask a custom question 

How do you think Generative AI is going to change the world? There is no right or wrong answer here, I am curious to hear what you think!

Send a static message  

Thank you! Next, I am going to ask you some technical questions about your past experience.

Ask a STAR-based skill question

Can you describe a time when you had to secure a network against a potential cyber threat? What steps did you take, and what was the outcome?

Ask a STAR-based skill question  

Tell me about a time when you had to migrate a system or application to the cloud. What challenges did you face, and how did you ensure a smooth transition?

Ask a STAR-based skill question  

Describe a situation where you had to optimize a database for better performance. What specific techniques did you use, and what was the impact?

Ask a STAR-based skill question  

Can you share an experience where you had to debug or improve PHP code in a large project? What approach did you take, and what was the result?

Send a closing message  

You have answered all the questions for this job, we will get back to you shortly. Thank you for your time!

---

Generation Guidelines:
1. Follow the exact structure of the example above.
2. Ensure a logical flow with:
   - A welcome message at the start.
   - A mix of different question types (custom, STAR-based, static messages).
   - A closing message at the end.
3. Question Types:  
   - Send a welcome message: Opens the interview and explains the process.  
   - Ask a custom question: General or open-ended questions that keep the conversation flowing (not strictly job-related).  
   - Send a static message: Used to transition between sections (e.g., “Now I will ask technical questions”).  
   - Ask a STAR-based skill question: Behavioural questions related to the job role. These should focus on past experiences and actions.  
   - Send a closing message: Wraps up the interview.  
   Before each question, add question type, and use full title like "Send a welcome message"

   Do not have any message before the welcome message 
4. DO NOT include any introductory text, explanations, or extra formatting like:
   - "Here are the questions for..."
   - Numbering, bullet points, or labels beyond what is shown in the example.
5. The response should ONLY contain the formatted script exactly like in the example.
6.  No numbering the questions
7. 
    """

    response = ollama.generate(
        model="llama3",
        prompt=llm_prompt,
        options={'temperature': 0.7}
    )

    response_text = response['response'].strip()

    colon_index = response_text.find(':')
    if colon_index != -1:
        response_text = response_text[colon_index + 1:].strip()  

    lines = [line.strip() for line in response_text.split("\n") if line.strip()]
    
    questions = []
    i = 0

    while i < len(lines) - 1:
        q_type = lines[i]   
        q_text = lines[i+1]
        questions.append({"type": q_type, "text": q_text})
        i += 2 

    return {"questions": questions}


@app.post("/new")
async def generateNewQuestion(request: Request):
    new_question_data = await request.json()

    if "newQuestionPrompt" not in new_question_data or not new_question_data["newQuestionPrompt"]:
        return {"error": "I apologize, but there is no prompt provided. Please provide a prompt."}

    prompt = f"""
    Generate one new question based on this prompt: 
    {new_question_data["newQuestionPrompt"]}
ONLY RETURN QUESTION, NOTHING ELSE
    """

    response = ollama.generate(
        model="llama3", 
        prompt=prompt,
        options={'temperature': 0.7}
    )

    new_question_text = response["response"]

    return {"response": new_question_text}
