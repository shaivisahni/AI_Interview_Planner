numOfQuestion = document.getElementById("num-of-question");
//numOfBehaviouralQuestion = document.getElementById("num-of-behavioural");
//numOfTechnicalQuestion = document.getElementById("num-of-technical");

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

        if(inputQuestionNumber == 1){
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

    const response = await fetch(`http://127.0.0.1:8000/generate?prompt=${encodeURIComponent(prompt)}`);
    const data = await response.json();

    console.log("Full API response:", data);

    document.getElementById("output").innerText = data.response.join("\n");


}


// some sort of a reset button


/*let currentTotal = (parseInt(numOfBehaviouralQuestion.value) + parseInt(numOfTechnicalQuestion.value));

if (totalQuestions > currentTotal) {
    let diff = totalQuestions - currentTotal;

    while (totalQuestions > currentTotal) {
        parseInt(numOfBehaviouralQuestion.value) += 1;
    }

}

if (totalQuestions < currentTotal) {
    let diff = currentTotal - totalQuestions;

    while (totalQuestions < currentTotal && parseInt(numOfBehaviouralQuestion.value) > 0) {
        parseInt(numOfBehaviouralQuestion.value) -= 1;
    }

    while (totalQuestions < currentTotal && parseInt(numOfTechnicalQuestion.value) > 0 && parseInt(numOfBehaviouralQuestion.value) == 0) {
        parseInt(numOfBehaviouralQuestion.value) -= 1;
    }

}*/
/*

function maxTechnicalQuestions() {
    numOfTechnicalQuestion.value = numOfQuestion.value - numOfBehaviouralQuestion.value
    if (parseInt(numOfTechnicalQuestion.value) < 1) {
        numOfTechnicalQuestion.value = 1
    }

    if (parseInt(numOfTechnicalQuestion.value) > parseInt(numOfQuestion.value)) {
        numOfTechnicalQuestion.value = parseInt(numOfQuestion.value);
    }
}

function maxBehaviouralQuestions() {
    numOfBehaviouralQuestion.value = numOfQuestion.value - numOfTechnicalQuestion.value

    if (parseInt(numOfBehaviouralQuestion.value) < 1) {
        numOfBehaviouralQuestion.value = 1
    }

    if (parseInt(numOfBehaviouralQuestion.value) > parseInt(numOfQuestion.value)) {
        numOfBehaviouralQuestion.value = parseInt(numOfQuestion.value);
    }
*/

