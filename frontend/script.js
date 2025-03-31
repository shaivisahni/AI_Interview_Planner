function showLoader() {
    const loaderContainer = document.getElementById("load_container");
    loaderContainer.classList.add("show");
}

// Hide the loader
function hideLoader() {
    const loaderContainer = document.getElementById("load_container");
    loaderContainer.classList.remove("show");
}

async function generateResponse() {
    const jobTitle = document.getElementById("job-title").value;
    const jobDescription = document.getElementById("job-description").value;

    if (!jobTitle || !jobDescription) {
        return;
    }

    showLoader();
    load_container.classList.add("show");
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

    hideLoader(); // Hide the loader when data is ready
    window.location.href = "question.html";
}



const modal_container = document.getElementById("modal_container");
const editTextarea = document.getElementById("edit-textarea");
const questionTypeSelect = document.getElementById("type");

let currentEditIndex = null;

function displayQuestions() {
    const data = JSON.parse(localStorage.getItem("interviewData"));
    const outputDiv = document.getElementById("output");

    outputDiv.innerHTML = `
        <div class="questions">
            ${data.questions.map((q, index) => `
                <div class="question-item" id="question-${index}">
                    <div class="question-type-container">
                        <div class="question-type">${q.type}</div>
                    </div>
                    <div class="question-content-row">
                        <div class="question-text">${q.text}</div>
                        <button onclick="editQuestion(${index})" class="edit-question">Edit</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

    
function editQuestion(index) {
    const data = JSON.parse(localStorage.getItem("interviewData"));
    const selectedQuestion = data.questions[index];

    currentEditIndex = index; // Store the index of the question being edited
    editTextarea.value = selectedQuestion.text; // Populate textarea with question text

    // Ensure dropdown updates properly
    const matchingOption = [...questionTypeSelect.options].find(option => option.value === selectedQuestion.type);
    if (matchingOption) {
        questionTypeSelect.value = selectedQuestion.type;
    } else {
        questionTypeSelect.selectedIndex = 0; // Default to first option if not found
    }

    modal_container.classList.add("show");
}

function saveEdit() {
    if (currentEditIndex === null) return;

    let data = JSON.parse(localStorage.getItem("interviewData"));

    // Update the question's text and type
    data.questions[currentEditIndex].text = editTextarea.value;
    data.questions[currentEditIndex].type = questionTypeSelect.value;

    // Save back to localStorage
    localStorage.setItem("interviewData", JSON.stringify(data));

    // Refresh displayed questions
    displayQuestions();

    // Close modal
    modal_container.classList.remove("show");
    currentEditIndex = null; // Reset the edit index
}

function cancelEdit() {
    modal_container.classList.remove("show");
    currentEditIndex = null;
}

function deleteCancelEdit() {
    delete_modal_container.classList.remove("show");
    currentEditIndex = null;
}

function deleteQuestion() {
    localStorage.removeItem("interviewData");
    window.location.href = "index.html";
}

function openDeleteQuestion() {
    delete_modal_container.classList.add("show");
}
