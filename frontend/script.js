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
    //const numQuestions = document.getElementById("num-of-question").value;
    //const questionType = document.querySelector('input[name="question-type"]:checked')?.value;
    const jobTitle = document.getElementById("job-title").value;
    const jobDescription = document.getElementById("job-description").value;
    //const company = document.getElementById("company").value;

    if (!jobTitle || !jobDescription) {
        return;
    }

    const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            job_title: jobTitle,
            job_description: jobDescription,
        })
    });

    const data = await response.json();

    localStorage.setItem("interviewData", JSON.stringify({
        questions: data.questions,
        meta: {
            jobTitle: jobTitle,
            date: new Date().toLocaleDateString()
        }
    }));

    window.location.href = "question.html";
}

function displayQuestions() {
    const data = JSON.parse(localStorage.getItem("interviewData"));
    const outputDiv = document.getElementById("output");

    outputDiv.innerHTML = `
    <div class="questions">
        ${data.questions.map((q, index) => `
            <div class="question-item" id="question-${index}">
                <!-- Only create a text box if the question is non-empty -->
                ${q.trim() ? `
                    <textarea id="question-text-${index}" class="question-text" rows="4">${q.trim()}</textarea>
                    <button onclick="editQuestion(${index})" class="edit-question">Edit</button>
                ` : ''}
            </div>
        `).join('')}
    </div>
`;
}

function editQuestion(){

}



