// Form Data
questions = [
    //introduction
    {
        "id": "introduction",
        "question": "Welcome! Press continue to get started.",
        "no-input": true,
        "required": false
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
                "text": "Yes",
                "nextQuestionId": "employer-name",
                "type": "button"
            },
            {
                "text": "No",
                "nextQuestionId": "marital-status",
                "type": "button"
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
                "type": "button"
            },
            {
                "text": "Salary",
                "nextQuestionId": "marital-status",
                "type": "button"
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
                "type": "button"
            },
            {
                "text": "Single",
                "nextQuestionId": "section-end",
                "type": "button"
            },
            {
                "text": "Separated",
                "nextQuestionId": "section-end",
                "type": "button"
            },
            {
                "text": "Other",
                "nextQuestionId": "elaborate",
                "type": "button"
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
        "question": "Welcome! Press continue to get started.",
        "start": true,
        "required": false
    },
    {
        "id": "test-1",
        "question": "Test w/ Text",
        "required": false
    },
    {
        "id": "test-2",
        "question": "Test w/ Options",
        "options": [
            {
                "text": "Go to Review",
                "nextQuestionId": "review",
                "type": "button"
            },
            {
                "text": "Go to Test 3",
                "nextQuestionId": "test-3",
                "type": "button"
            }
        ],
        "required": true
    },
    {
        "id": "test-3",
        "question": "Test w/ Date",
        "type": "date",
        "required": true
    },
    {
        "id": "review",
        "question": "Please review your information and select any fields you would like to edit!",
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


let currentQuestionIndex = 0;
let formData = {};

// Initialize the form
function initForm() {
    displayQuestion(currentQuestionIndex);
    updateProgressBar();
}

// Display the current question
function displayQuestion(index) {
    //questions = test_questions;
    const question = questions[index];
    document.getElementById("current-question").innerHTML = `<h4>Q. ${question.question}</h4>`;
    document.getElementById("next-button").style.marginTop = "20px";
    document.getElementById("next-button").innerHTML = "Next";

    const answerArea = document.getElementById("answer-area");
    answerArea.innerHTML = "";

    //remove intro text after welcome screen
    if (index == 1) {
        document.getElementById("intro-text").remove();
    }

    if (index == questions.length - 1) {
        
    }
    //handler for questions with radio options
    if (question.options) {
        
        if (question.review) {
            opt_i = 0;
            for (key in formData) {
                question.options.push({});

                field_question = questions[questions.findIndex(q => q.id === key)];
                    console.log(field_question.question + ": " + formData[key]);
                option = question.options[opt_i];
                option.text = field_question.question + ": " + formData[key];
                option.type = "checkbox";
                option.nextQuestionId = field_question.id;

                opt_i++;
            }
        } else {
            document.getElementById("next-button").style.visibility = "hidden";
        }

    
        question.options.forEach(option => {

            const inputElement = document.createElement("input");
            inputElement.type = option.type;

            if (option.type == "button") {
                
            }

            inputElement.name = "answer";
            inputElement.id = option.text;
            inputElement.value = option.text;

            const label = document.createElement("label");
            label.htmlFor = inputElement.id;
            label.textContent = option.text;

            const optionContainer = document.createElement("div");
 
            if (question.review) {
                q = questions[questions.findIndex(q => q.id === option.nextQuestionId)];
                if (!q.options) {
                    inputElement.addEventListener('change', (event) => {
                        q = questions[questions.findIndex(q => q.id === option.nextQuestionId)];
                        if (event.target.checked) {
                            editElement = document.createElement("input");
                            
                            editElement.type = q.type;
                            editElement.name = option.nextQuestionId;
                            editElement.id = "answer-text";
                            editElement.placeholder = "Enter the corrected " + q.question + " here.";
                            
                            editElement.style.marginTop = "5px";
                            editElement.style.marginBottom = "10px";

                            optionContainer.removeChild(label);
                            label.textContent = q.question + ":";
                            optionContainer.appendChild(label)
                            optionContainer.appendChild(editElement);
                            
                        } else {
                            label.textContent = option.text;
                            optionContainer.appendChild(label);
                            field_list_length = document.getElementsByName(option.nextQuestionId).length;
                            while (field_list_length > 0) {
                                document.getElementsByName(option.nextQuestionId)[field_list_length - 1].remove();
                                field_list_length = document.getElementsByName(option.nextQuestionId).length;
                        }
                        }
                    });
                    optionContainer.appendChild(inputElement);
                    optionContainer.appendChild(label);
                }
            } else {
                inputElement.onclick = () => {
                    formData[question.id] = option.text;
                    nextQuestion(option.nextQuestionId);
                    document.getElementById("next-button").style.visibility = "visible";
                };
                optionContainer.appendChild(inputElement);
                //optionContainer.appendChild(label);
            }
                
            answerArea.appendChild(optionContainer);
        
        });
    } else {  // handler for all other input types
        const inputElement = document.createElement("input");
        inputElement.type = question.type;
        inputElement.id = "answer-text";
        inputElement.placeholder = "Enter your answer";
        inputElement.addEventListener('keydown', handleEnterPress);

        if (question.type === "date") {
            const date = new Date();
            const noMinorsAllowed = new Date(date.getTime() - (18 * 365 * 24 * 60 * 60 * 1000));
            inputElement.max = noMinorsAllowed.toISOString().split("T")[0]; // Set max date to today
        }

        if (question.type === "tel") {
            inputElement.addEventListener('input', function(e) {
            let inputValue = this.value.replace(/\D/g, '');
            let formattedValue = '';
            let selectionStart = this.selectionStart; // Get cursor position
        
            if (inputValue.length > 0) {
                formattedValue += inputValue.substring(0, 3);
            }
            if (inputValue.length > 3) {
                formattedValue += '-' + inputValue.substring(3, 6);
            }
            if (inputValue.length > 6) {
                formattedValue += '-' + inputValue.substring(6, 10);
            }
        
        
            this.value = formattedValue;
        
            // Adjust cursor position after formatting 
            if (inputValue.length === 4 || inputValue.length === 7) { // Just added a dash
                selectionStart++;
            }
            if (e.inputType === 'deleteContentBackward' && (this.value.length === 4 || this.value.length === 8)) { // Deleted a dash
                selectionStart--; 
            }
        
            this.setSelectionRange(selectionStart, selectionStart);  // Set the cursor
        
        
            if (this.value.length > 12) {
                this.value = this.value.slice(0, 12);
            }
        });
        }

        if (question.end) {
            document.getElementById("next-button").innerHTML = "Submit";
            question.noInput = true;
        }

        if (question.start) {
            document.getElementById("next-button").innerHTML = "Begin";
            question.noInput = true;
        }

        if (question.noInput) {
            document.getElementById("current-question").innerHTML = `<h4>${question.question}</h4>`;
            document.getElementById("next-button").style.margin = "0px";
            return;
        }
        if (question.address) {
            inputElement.placeholder = "Start typing and select your address from the list.";
            const debounce = (func, delay) => {
                let timeoutId;
                return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
                };
            };
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'suggestions';
            answerArea.parentElement.insertBefore(suggestionsDiv, answerArea.nextSibling); // Add div below the input

            
            
            inputElement.addEventListener(
                'input',
                debounce(async (e) => {
                const searchTerm = e.target.value;
                if (searchTerm.length < 3) {  // Only search if at least 3 characters
                    suggestionsDiv.innerHTML = '';
                    return;
                }
            
                try {
                    // Nominatim API (OpenStreetMap)
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&countrycodes=us&addressdetails=1`); // Limit to US
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
            
                    // Clear previous suggestions
                    suggestionsDiv.innerHTML = '';
            
                    if (data.length > 0) {
            
                        data.forEach(address => {
                            const suggestion = document.createElement('div');
                            suggestion.className = 'suggestion';
                            suggestion.textContent = address.display_name;
                            suggestion.addEventListener('click', () => {
                                console.log(address.display_name);
                                inputElement.value = address.display_name; // Update input with selection
                                suggestionsDiv.innerHTML = ''; // Hide suggestions after selection
                                // Populate other form fields with address components as needed
                                // Example:
                                // document.getElementById('city').value = address.address.city || address.address.town || address.address.village;
                                // document.getElementById('state').value = address.address.state;
                                // document.getElementById('postcode').value = address.address.postcode;
            
            
                            });
                            suggestionsDiv.appendChild(suggestion);
                        });
            
                    } else {
                        suggestionsDiv.innerHTML = '<div class="suggestion">No results found</div>';
                    }
            
                } catch (error) {
                    console.error("Error fetching address suggestions:", error);
                    suggestionsDiv.innerHTML = '<div class="suggestion">Error fetching suggestions</div>';
                }
                }, 300) // 300ms delay
            );
            
            
            // Add CSS for styling
            const style = document.createElement('style');
            style.textContent = `
            #suggestions {

                    background: #fff;
                    border: 1px solid #ccc;
                    max-height: 200px;
                    overflow-y: auto;
                    font-size: 10px;
                    z-index: 10; /* Ensure suggestions appear above other elements */
                    box-sizing: border-box; /* Include padding and border in element's total width and height */
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

        inputElement.addEventListener("input", () => {
            formData[question.id] = inputElement.value;
        });

        answerArea.appendChild(inputElement);
    }
}



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
    while (questions[currentQuestionIndex].review && document.getElementById("answer-text") != null) {
        editedField = document.getElementById("answer-text");
        formData[editedField.name] = editedField.value;
        document.getElementById("answer-text").parentElement.remove();
    }
    if (validateAnswer()) {
        if (questions[currentQuestionIndex].address) {
            document.getElementById("suggestions").remove();
        }
        if (nextQuestionId) {
            const nextIndex = questions.findIndex(q => q.id === nextQuestionId);
            currentQuestionIndex = nextIndex;
        } else {
            currentQuestionIndex++;
        }
        
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
            updateProgressBar();
        } else {
            // Handle form submission or end of form logic
            alert("Form submitted successfully!");
            console.log(formData); // Log the collected form data
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
document.getElementById("next-button").addEventListener("click", () => {
    nextQuestion()
});

// Initialize the form
initForm();