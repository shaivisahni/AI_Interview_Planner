numOfQuestion = document.getElementById("num-of-question");

function checkNumInput() {
    let totalQuestions = parseInt(numOfQuestion.value);

    if (totalQuestions > 99) {
        numOfQuestion.value = 99;
        totalQuestions = 99;
    }

    if (totalQuestions < 1) {
        numOfQuestion.value = 1;
        totalQuestions = 1;
    }

}

async function generateResponse() {

    const inputQuestionNumber = document.getElementById("num-of-question").value;
    const inputQuestionType = document.querySelector('input[name="question-type"]:checked')?.value;
    const inputJob = document.getElementById("job-title").value;
    const inputJobDescription = document.getElementById("job-description").value;
    const company = document.getElementById("company").value;


    if (!inputQuestionNumber || !inputQuestionType || !inputJob || !inputJobDescription || !company) {
        document.getElementById("output").innerText = "ANSWER THE QUESTION";
        return;
    }

    let prompt = "Generate exactly " + inputQuestionNumber + " interview questions for the following position at " + company + " company:\n";
    prompt += "Job Title: " + inputJob + ".\n";
    prompt += "Job Description:\n" + inputJobDescription + "\n\n";

    if (inputQuestionType === "Both") {

        if (inputQuestionNumber == 1) {
            prompt += "ONLY GENERATE ONE QUESTION. either behavioral or technical \n"
        } else {
            prompt += "Generate " + inputQuestionNumber + " questions that are either behavioral and the other half technical.\n";
        }

    } else {
        prompt += "Generate " + inputQuestionNumber + " " + inputQuestionType + " questions only.\n";
    }

    prompt += "Do not include any explanations, alternatives, or extra text—only the interview questions.\n";
    prompt += "Each question must be numbered in order, starting from 1.\n";
    prompt += "Do not add \" behavioral \" or  \" technical \" in the response.\n";
    prompt += "Do not include original prompt in questions.\n"; 

    const response = await fetch(`http://127.0.0.1:8000/generate?prompt=${encodeURIComponent(prompt)}`);
    const data = await response.json();

    localStorage.setItem("generatedQuestions", JSON.stringify(data.response));
    window.location.href = "question.html"

}

function getQuestions() {
    storedQuestions = localStorage.getItem("generatedQuestions");

    document.getElementById("output").innerText = JSON.parse(storedQuestions).join("\n");

}
