/*numOfQuestion = document.getElementById("num-of-question");

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
*/

const modal_container = document.getElementById("modal_container");

async function generateResponse() {
    const jobTitle = document.getElementById("job-title").value;
    const jobDescription = document.getElementById("job-description").value;

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

    const structuredQuestions = data.questions.map(q => ({
        type: q.type, 
        text: q.text
    }));
    
    localStorage.setItem("interviewData", JSON.stringify({
        questions: structuredQuestions,
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
                    <!-- Left: Question Type -->
                    <textarea id="question-type-${index}" class="question-type" rows="2" readonly>${q.type}</textarea>

                    <!-- Right: AI-Generated Question -->
                    <textarea id="question-text-${index}" class="question-text" rows="4" readonly>${q.text}</textarea>

                    <!-- Edit Button -->
                    <button onclick="editQuestion(${index})" class="edit-question">Edit</button>
                </div>
            `).join('')}
        </div>
    `;
}

    


function editQuestion(index) {
    modal_container.classList.add('show');
}


function saveEdit() {

    modal_container.classList.remove('show');

}

function cancelEdit() {
    modal_container.classList.remove('show');

}

function deleteQuestion() {

}
