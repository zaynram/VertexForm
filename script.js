// Form Data
questions = [
    //introduction
    {
        "id": "introduction",
        "question": "Press begin to get started.",
        "review": true,
        "required": false,
        "options": []
    },
    //personal
    {
        "id": "full-legal-name",
        "question": "Full Legal Name",
        "name": true,
        "required": true
    },
    {
        "id": "date-of-birth",
        "question": "Date of Birth",
        "type": "date",
        "required": true
    },
    //contact
    {
        "id": "email-address",
        "question": "Email Address",
        "type": "email",
        "required": true
    },
    {
        "id": "phone-number",
        "question": "Phone Number",
        "type": "tel",
        "phone": true,
        "required": true
    },
    //address
    {
        "id": "street-address",
        "question": "Street Address",
        "address": true,
        "required": true
    },
    //employment
    {
        "id": "currently-employed",
        "question": "Current Employment Status",
        "options": [
            {
                "text": "Employed",
                "nextQuestionId": "employer-name",
                "type": "radio"
            },
            {
                "text": "Unemployed",
                "nextQuestionId": "marital-status",
                "type": "radio"
            }
        ],
        "required": true
    },
    {
        "id": "employer-name",
        "question": "Name of Employer",
        "required": true
    },
    {
        "id": "income-type",
        "question": "Income Type",
        "required": true,
        "options": [
            {
                "text": "Hourly",
                "nextQuestionId": "employer-name",
                "type": "radio"
            },
            {
                "text": "Salary",
                "nextQuestionId": "marital-status",
                "type": "radio"
            }
        ]
    },
    //marriage
    {
        "id": "marital-status",
        "question": "Current Marital Status",
        "options": [
            {
                "text": "Married",
                "nextQuestionId": "spouse-legal-name",
                "type": "radio"
            },
            {
                "text": "Single",
                "nextQuestionId": "section-end",
                "type": "radio"
            },
            {
                "text": "Separated",
                "nextQuestionId": "section-end",
                "type": "radio"
            },
            {
                "text": "Other",
                "nextQuestionId": "elaborate",
                "type": "radio"
            }
        ],
        "required": true
    },
    //case background
    {
        "id": "case-description",
        "question": "Case Overview",
        "required": true
    },
    //conclusion
    {
        "id": "section-end",
        "question": "Thank you for your time! Please review your information and ensure it is accurate.<br>",
        "review": true,
        "options": []
    }
];

const test_questions = [
    {
        "id": "introduction",
        "question": "Press begin to get started.",
        "start": true,
        "required": false
    },
    {
        "id": "test-1",
        "question": "Text Input",
        "required": false
    },
    {
        "id": "test-2",
        "question": "Next Page To Visit",
        "options": [
            {
                "text": "Review Answers",
                "nextQuestionId": "review",
                "type": "radio"
            },
            {
                "text": "Date Input",
                "nextQuestionId": "test-3",
                "type": "radio"
            }
        ],
        "required": true
    },
    {
        "id": "test-3",
        "question": "Date Input",
        "type": "date",
        "required": true
    },
    {
        "id": "review",
        "question": "Please review your information and ensure it is accurate.",
        "required": false,
        "review": true,
        "options": [],
    },
    {
        "id": "section-end",
        "question": "Thank you for your time!",
        "required": false,
        "end": true
    }
]

testing = false;
if (testing) questions = test_questions;

let currentQuestionIndex = 0;
let formData = {};

// Initialize the form
function initForm() {
    displayQuestion(currentQuestionIndex);
    updateProgressBar();
    addNextButtonListener();
}
// Display the current question
function displayQuestion(index) {
    const question = questions[index];
    const currentQuestion = document.getElementById("current-question");
    const answerArea = document.getElementById("answer-area");
    
    currentQuestion.innerHTML = question.review ? 
        `<h4>${question.question}</h4>` : 
        `<h4>${index}. ${question.question}?</h4>`;

    handleNextButton(question);
    
    answerArea.innerHTML = "";

    if (index === 1) {
        document.getElementById("intro-text").remove();
        document.getElementById("form-header").innerHTML = "Personal Information";
    }

    question.options ? 
        handleOptionsQuestion(question, answerArea) : 
        handleInputQuestion(question, answerArea);
}

function handleNextButton(question) {
    if (document.getElementById("next-button")) {
        const nextButton = document.getElementById("next-button");
        nextButton.style.marginTop = question.review ? "10px" : "20px";
        nextButton.innerHTML = "Next";
    } else {
        document.getElementById("option-button").remove();
        const nextButton = document.createElement("button");
        nextButton.id = "next-button";
        nextButton.style.marginTop = "10px";
        nextButton.innerHTML = "Next";
        document.getElementById("form-container").appendChild(nextButton);
        addNextButtonListener();
    }
}

function handleOptionsQuestion(question, answerArea) {
    if (question.review) {
        buildReviewOptions(question);
        qArea = document.getElementById("question-area");
        subtextElement = document.createElement("p");
        subtextElement.innerHTML = 'Check the boxes for all of the fields you wish to change then type the correct values in.';
        answerArea.insertBefore(subtextElement, answerArea.firstChild);
        subtextElement.style.marginTop = "-15px";
    } else document.getElementById("next-button").remove();

    question.options.forEach(option => {
        const optionContainer = createOptionContainer(question, option);
        answerArea.appendChild(optionContainer);
    });
}

function buildReviewOptions(question) {
    let optIndex = 0;
    for (let key in formData) {
        const fieldQuestion = questions[questions.findIndex(q => q.id === key)];
        question.options.push({
            text: `${fieldQuestion.question}: ${formData[key]}`,
            type: "checkbox",
            nextQuestionId: fieldQuestion.id
        });
        optIndex++;
    }
}

function createInputElement(option) {
    const inputElement = document.createElement("input");
    inputElement.type = option.type || "radio";
    inputElement.name = "answer";
    inputElement.value = option.text;
    return inputElement;
}

function createOptionContainer(question, option) {
    const optionContainer = document.createElement("div");
    const inputElement = createInputElement(option);
    const label = document.createElement("label");
    label.innerHTML = option.text;

    if (question.review) {
        handleReviewOption(question, option, optionContainer, inputElement, label);
    } else {
        handleNormalOption(question, option, optionContainer, inputElement);
    }

    return optionContainer;
}

function handleReviewOption(question, option, optionContainer, inputElement, label) {
    optionContainer.appendChild(inputElement);
    optionContainer.appendChild(label);
    inputElement.style.marginBottom = "15px";
    
    const notifyElement = createNotificationElement();
    let editElement = null;

    inputElement.addEventListener("change", () => {
        toggleNotification(notifyElement);
        const questionData = getQuestionData(option.nextQuestionId);
        
        if (inputElement.checked) {
            editElement = createEditElement(questionData, option.nextQuestionId);
            updateLabelAndContainer(label, optionContainer, editElement, option);
        } else {
            removeEditElement(editElement, label, option);
            notifyElement.remove();
        }
    });
}

function createNotificationElement() {
    const element = document.createElement("p");
    element.id = "save-edits";
    element.innerHTML = "Changes are saved automatically on page submission.";
    element.style.marginBottom = "-10px";
    element.style.fontSize = "90%";
    return element;
}

function toggleNotification(notifyElement) {
    if (!document.getElementById("save-edits")) {
        document.getElementById("form-container").appendChild(notifyElement);
    }
}

function getQuestionData(questionId) {
    return questions[questions.findIndex(q => q.id === questionId)];
}

function createEditElement(questionData, questionId) {
    const element = document.createElement("input");
    element.type = questionData.type || "text";
    element.name = questionId;
    element.id = "review-input";
    element.placeholder = "Enter the corrected " + questionData.question + " here.";
    element.value = formData[questionId] || "";
    
    element.addEventListener("input", () => {
        formData[questionId] = element.value;
    });
    
    return element;
}

function updateLabelAndContainer(label, container, editElement, option) {
    label.textContent = option.text.split(":")[0] + ": ";
    container.insertBefore(editElement, label.nextSibling);
}

function removeEditElement(editElement, label, option) {
    if (editElement) {
        label.textContent = option.text;
        editElement.parentNode.removeChild(editElement);
    }
}

function handleNormalOption(question, option, optionContainer, inputElement) {
    optionContainer.classList.add("option-container");
    optionContainer.appendChild(inputElement);
    optionContainer.appendChild(document.createTextNode(option.text));

    const optionSubmitElement = document.createElement("button");
    optionSubmitElement.id = "option-button";
    optionSubmitElement.innerHTML = "Next";
    optionSubmitElement.style.marginTop = "10px";
  
    inputElement.addEventListener("click", () => {
        formData[question.id] = option.text;
        
        if (!document.getElementById("option-button")) {
            document.getElementById("form-container").appendChild(optionSubmitElement);
        }
        
        document.querySelectorAll(".option-container").forEach(container => {
            container.classList.remove("selected");
        });
        optionContainer.classList.add("selected");
    });

    optionSubmitElement.addEventListener("click", () => {
        nextQuestion(option.nextQuestionId);
    });
}

function createInputElement(option) {
    const inputElement = document.createElement("input");
    inputElement.type = option.type || "radio";
    inputElement.name = "answer";
    inputElement.value = option.text;
    return inputElement;
}

function handleInputQuestion(question, answerArea) {
    if (question.noInput || handleSpecialQuestions(question)) {
        return;
    }

    const inputElement = document.createElement("input");
    inputElement.type = question.type;
    inputElement.id = "answer-text";
    inputElement.placeholder = question.placeholder ? question.placeholder : "Please enter your " + question.question.toLowerCase() + " here.";
    inputElement.addEventListener('keydown', handleEnterPress);

    switch(question.type) {
        case 'date':
            setupDateInput(inputElement);
            break;
        case 'tel':
            setupPhoneInput(inputElement);
            break;
    }

    if (question.address) {
        setupAddressInput(inputElement, answerArea);
    }

    inputElement.addEventListener("input", () => {
        formData[question.id] = inputElement.value;
    });

    answerArea.appendChild(inputElement);
}

function handleSpecialQuestions(question) {
    if (question.end) {
        document.getElementById("next-button").innerHTML = "Submit";
        question.noInput = true;
        updateQuestionDisplay(question);
        return true;
    }
    if (question.start) {
        document.getElementById("next-button").innerHTML = "Begin";
        question.noInput = true;
        updateQuestionDisplay(question);
        return true;
    }
    return false;
}

function updateQuestionDisplay(question) {
    document.getElementById("current-question").innerHTML = `<h4>${question.question}</h4>`;
    document.getElementById("next-button").style.margin = "0px";
}

function setupDateInput(inputElement) {
    const date = new Date();
    const noMinorsAllowed = new Date(date.getTime() - (18 * 365 * 24 * 60 * 60 * 1000));
    inputElement.max = noMinorsAllowed.toISOString().split("T")[0];
}

function setupPhoneInput(inputElement) {
    inputElement.addEventListener('input', formatPhoneNumber);
}

function formatPhoneNumber(e) {
    let inputValue = this.value.replace(/\D/g, '');
    let formattedValue = '';
    let selectionStart = this.selectionStart;

    if (inputValue.length > 0) formattedValue += inputValue.substring(0, 3);
    if (inputValue.length > 3) formattedValue += '-' + inputValue.substring(3, 6);
    if (inputValue.length > 6) formattedValue += '-' + inputValue.substring(6, 10);

    this.value = formattedValue;

    if (inputValue.length === 4 || inputValue.length === 7) selectionStart++;
    if (e.inputType === 'deleteContentBackward' && (this.value.length === 4 || this.value.length === 8)) selectionStart--;

    this.setSelectionRange(selectionStart, selectionStart);

    if (this.value.length > 12) {
        this.value = this.value.slice(0, 12);
    }
}

function setupAddressInput(inputElement, answerArea) {
    inputElement.placeholder = "Start typing and select your address from the list.";
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'suggestions';
    answerArea.parentElement.insertBefore(suggestionsDiv, answerArea.nextSibling);

    inputElement.addEventListener('input', debounce(handleAddressSearch, 300));
    setupAddressStyles();
}

function handleAddressSearch(e) {
    const searchTerm = e.target.value;
    const suggestionsDiv = document.getElementById('suggestions');

    if (searchTerm.length < 3) {
        suggestionsDiv.innerHTML = '';
        return;
    }

    fetchAddressSuggestions(searchTerm, suggestionsDiv);
}

async function fetchAddressSuggestions(searchTerm, suggestionsDiv) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&countrycodes=us&addressdetails=1`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        displayAddressSuggestions(data, suggestionsDiv);
    } catch (error) {
        console.error("Error fetching address suggestions:", error);
        suggestionsDiv.innerHTML = '<div class="suggestion">Error fetching suggestions</div>';
    }
}

function displayAddressSuggestions(suggestions, suggestionsDiv) {
    if (!suggestions.length) {
        suggestionsDiv.innerHTML = '<div class="suggestion">No results found</div>';
        return;
    }

    suggestionsDiv.innerHTML = suggestions
        .map(place => {
            const address = place.address;
            const displayAddress = `${address.house_number || ''} ${address.road || ''}, ${address.city || ''}, ${address.state || ''} ${address.postcode || ''}`.trim();
            return `<div class="suggestion" data-address="${displayAddress}">${displayAddress}</div>`;
        })
        .join('');

    suggestionsDiv.querySelectorAll('.suggestion').forEach(div => {
        div.addEventListener('click', () => {
            document.getElementById("answer-text").value = div.dataset.address;
            suggestionsDiv.innerHTML = '';
        });
    });
}

function setupAddressStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #suggestions {
            background: #fff;
            border: 1px solid #ccc;
            max-height: 200px;
            overflow-y: auto;
            font-size: 10px;
            z-index: 10;
            box-sizing: border-box;
        }
        .suggestion {
            padding: 8px;
            cursor: pointer;
        }
        .suggestion:hover {
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(style);
}

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};
// Validation function calling by question type
function validateAnswer() {
    const question = questions[currentQuestionIndex];
    const answer = formData[question.id];

    if (question.required && !answer) {
        alert("Please answer this question.");
        return false;
    }

    if (question.type == "email" && !isValidEmail(answer)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (question.name && !isValidName(answer)) {
        alert("Please enter your full legal name.")
        return false;
    }

    if (question.type == "tel" && !isValidPhone(answer)) {
        alert("Please enter a valid phone number.")
        return false;
    }


    // Add more validation logic here based on question type and context

    return true;
}
// Validation functions
function isValidEmail(email) {
    // Basic email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidName(name) {
    // Basic email format validation using regular expression
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}
function isValidPhone(phone) {
    // Basic email format validation using regular expression
    const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    return phoneRegex.test(phone);
}
// Move to the next question
function nextQuestion(nextQuestionId) {
    if (validateAnswer()) {
        if (questions[currentQuestionIndex].address) {
            document.getElementById("suggestions").remove();
        }
        
        // Logic to handle nextQuestionId
        if (nextQuestionId) {
            currentQuestionIndex = questions.findIndex(q => q.id === nextQuestionId);
        } else {
            currentQuestionIndex++;
        }

        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
            updateProgressBar();
        } else {
            alert("Form submitted successfully!");
            console.log(formData);
        }
    }
}
// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById("progress-fill");
    const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = percentage + "%";
}
//allow form progression with "enter" keypresses
function handleEnterPress(event) {
    if (event.key === 'Enter') {
      nextQuestion();
    }
  }
// Event listeners
function addNextButtonListener() {
    document.getElementById("next-button").addEventListener("click", () => {
        if (questions[currentQuestionIndex].review && document.getElementById("save-edits")) document.getElementById("save-edits").remove();
        nextQuestion()
    });
}

// Initialize the form
initForm();