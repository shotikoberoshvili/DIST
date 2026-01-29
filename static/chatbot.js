document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // Element References
    // ===============================
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeBtn = document.getElementById("close-chatbot");
    const messagesContainer = document.getElementById("chatbot-messages");
    const inputField = document.getElementById("chatbot-input-field");
    const sendButton = document.getElementById("send-message-btn");
    const typingIndicator = document.getElementById("typing-indicator");


    // ===============================
    // Simple Exact Responses
    // ===============================
    const responses = {
        "გამარჯობა": "გამარჯობა! 😊 როგორ შემიძლია დაგეხმაროთ DIST-ის შესახებ?",
        "hello": "Hello! 😊 I am the DIST chatbot. How can I help you?",
        "hi": "გამარჯობა! 😊 როგორ შემიძლია დაგეხმაროთ?",
        "მადლობა": "არაფრის! 😊 კიდევ რამე კითხვა გაქვთ DIST-ზე?",
        "ნახვამდის": "ნახვამდის! წარმატებებს გისურვებთ სწავლაში 📚✨",
        "bye": "Goodbye! წარმატებები DIST-თან ერთად 🚀"
    };


    // ===============================
    // DIST Knowledge Base
    // ===============================
    const knowledgeBase = {

        // Greeting
        "გამარჯობა|hello|hi|სალამი": {
            response: "გამარჯობა! მე ვარ DIST-ის ჩათბოტი 🤖 როგორ შემიძლია დაგეხმაროთ სწავლასთან დაკავშირებით?",
            options: [
                "რა არის DIST?",
                "როგორ მუშაობს DIST?",
                "ვინ არიან მენტორები?",
                "როგორ დავიწყო სესია?"
            ]
        },

        // About DIST
        "რა არის DIST|რაა dist|რა არის dist": {
            response: "DIST არის პლატფორმა, რომელიც აკავშირებს უნივერსიტეტის სტუდენტებს წარმატებულ სტუდენტ-მენტორებთან, რათა რთული საგნების სწავლა გახდეს მარტივი და გასაგები.",
            options: [
                "როგორ მუშაობს DIST?",
                "ვისთვის არის DIST?",
                "ვინ არიან მენტორები?"
            ]
        },

        // Target Audience
        "ვისთვის არის DIST|აუდიტორია|ვინ იყენებს": {
            response: "DIST-ის მთავარი აუდიტორიაა საქართველოს უნივერსიტეტების 1-3 კურსის სტუდენტები, რომლებსაც რთულ აკადემიურ საგნებში სჭირდებათ დამატებითი დახმარება.",
            options: [
                "ვინ არიან მენტორები?",
                "როგორ დავიწყო სესია?",
                "რა შედეგს მაძლევს DIST?"
            ]
        },

        // Mentors
        "ვინ არიან მენტორები|მენტორი": {
            response: "DIST-ზე მენტორები არიან მაღალი აკადემიური მოსწრების მქონე სტუდენტები, რომლებმაც უკვე გაიარეს ეს გზა და შეუძლიათ რთული თემების ახსნა მარტივად და შენს ტემპში.",
            options: [
                "როგორ გავხდე მენტორი?",
                "როგორ მუშაობს რეიტინგი?",
                "როგორ ტარდება სესიები?"
            ]
        },

        // Platform Process
        "როგორ მუშაობს DIST|როგორ ვიყენებ|როგორ დავიწყო": {
            response:
                "DIST-ის გამოყენება მარტივია:\n\n" +
                "1. სტუდენტი რეგისტრირდება პლატფორმაზე\n" +
                "2. ირჩევს შესაბამის მენტორს\n" +
                "3. ტარდება ონლაინ სესია (30–120 წუთი)\n" +
                "4. სტუდენტი აფასებს სესიას\n" +
                "5. მენტორი იღებს ანაზღაურებას და რეიტინგი იზრდება",
            options: [
                "რამდენ ხანს გრძელდება სესია?",
                "როგორ მუშაობს რეიტინგი?",
                "რა არის DIST-ის მიზანი?"
            ]
        },

        // Session Duration
        "რამდენ ხანს გრძელდება სესია|სესიის დრო": {
            response: "DIST-ზე სესიები არის მოქნილი და გრძელდება 30-დან 120 წუთამდე, სტუდენტის საჭიროების მიხედვით.",
            options: [
                "როგორ დავიწყო სესია?",
                "ვინ არიან მენტორები?",
                "რა შედეგს მაძლევს DIST?"
            ]
        },

        // Rating System
        "როგორ მუშაობს რეიტინგი|რეიტინგი": {
            response: "სესიის დასრულების შემდეგ სტუდენტები აფასებენ მენტორებს. მაღალი რეიტინგის მქონე მენტორები უფრო მეტ ნდობას იღებენ და შეუძლიათ მეტი შემოსავალი ჰქონდეთ.",
            options: [
                "როგორ გავხდე მენტორი?",
                "როგორ მუშაობს DIST?",
                "რა არის DIST-ის მიზანი?"
            ]
        },

        // Goal
        "რა არის DIST-ის მიზანი|რისთვის არის DIST": {
            response: "DIST-ის მთავარი მიზანია სტუდენტებისთვის აკადემიური სტრესის შემცირება და სწავლის პროცესის გამარტივება, რათა არცერთი სტუდენტი არ დარჩეს მარტო რთულ საგნებთან.",
            options: [
                "რა არის DIST?",
                "როგორ მუშაობს DIST?",
                "როგორ დავიწყო სესია?"
            ]
        },

        // Main Message
        "გზავნილი|სლოგანი": {
            response: "DIST — ცოდნა, რომელიც ბრუნავს და მუშაობს. 📚✨",
            options: [
                "როგორ მუშაობს DIST?",
                "ვინ არიან მენტორები?",
                "როგორ დავიწყო სესია?"
            ]
        }
    };


    // ===============================
    // Toggle Chatbot
    // ===============================
    chatbotToggle.addEventListener("click", function () {
        chatbotContainer.style.display = "flex";
        inputField.focus();

        if (!chatbotContainer.dataset.initialized) {
            chatbotContainer.dataset.initialized = "true";
            addWelcomeMessage();
        }
    });

    closeBtn.addEventListener("click", function () {
        chatbotContainer.style.display = "none";
    });


    // ===============================
    // Welcome Message
    // ===============================
    function addWelcomeMessage() {
        const welcomeMessage =
            "გამარჯობა! 👋 მე ვარ DIST-ის ჩათბოტი 🤖\n" +
            "აქ ვარ, რომ დაგეხმარო სწავლასთან და მენტორებთან დაკავშირებით.\n\n" +
            "რა გაინტერესებს?";

        const quickQuestions = [
            "რა არის DIST?",
            "როგორ მუშაობს DIST?",
            "ვინ არიან მენტორები?",
            "როგორ დავიწყო სესია?"
        ];

        addMessage(welcomeMessage, "bot", quickQuestions);
    }


    // ===============================
    // Send Message
    // ===============================
    function sendMessage() {
        const message = inputField.value.trim();
        if (message === "") return;

        addMessage(message, "user");
        inputField.value = "";

        typingIndicator.style.display = "flex";

        setTimeout(() => {
            typingIndicator.style.display = "none";
            const botResponse = getBotResponse(message);
            addMessage(botResponse.text, "bot", botResponse.suggestions);
        }, 700);
    }


    // ===============================
    // Add Message to Chat
    // ===============================
    function addMessage(text, sender, suggestions = []) {
        const messageContainer = document.createElement("div");
        messageContainer.className = "message-container";

        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = text.replace(/\n/g, "<br>");

        messageContainer.appendChild(messageDiv);

        // Suggestion Chips
        if (suggestions.length > 0) {
            const chipsContainer = document.createElement("div");
            chipsContainer.className = "suggestion-chips";

            suggestions.forEach((suggestion) => {
                const chip = document.createElement("div");
                chip.className = "suggestion-chip";
                chip.textContent = suggestion;

                chip.addEventListener("click", () => {
                    inputField.value = suggestion;
                    sendMessage();
                });

                chipsContainer.appendChild(chip);
            });

            messageContainer.appendChild(chipsContainer);
        }

        messagesContainer.appendChild(messageContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }


    // ===============================
    // Bot Response Logic
    // ===============================
    function getBotResponse(message) {
        const originalMessage = message.trim();
        const normalizedMessage = message.toLowerCase().trim();

        // Exact Match
        if (responses[originalMessage]) {
            return {
                text: responses[originalMessage],
                suggestions: ["რა არის DIST?", "როგორ მუშაობს DIST?", "ვინ არიან მენტორები?"]
            };
        }

        // Knowledge Base Search
        for (const pattern in knowledgeBase) {
            const keywords = pattern.split("|");

            for (const keyword of keywords) {
                if (normalizedMessage.includes(keyword.toLowerCase())) {
                    return {
                        text: knowledgeBase[pattern].response,
                        suggestions: knowledgeBase[pattern].options || []
                    };
                }
            }
        }

        // Default Response
        return {
            text: "უკაცრავად, ვერ მივხვდი კითხვას 😅\nაირჩიე ერთ-ერთი ვარიანტი:",
            suggestions: [
                "რა არის DIST?",
                "როგორ მუშაობს DIST?",
                "ვინ არიან მენტორები?",
                "როგორ მუშაობს რეიტინგი?"
            ]
        };
    }


    // ===============================
    // Event Listeners
    // ===============================
    inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);


    // ===============================
    // Responsive Adjustments
    // ===============================
    function adjustChatbotForScreenSize() {
        if (window.innerWidth <= 768) {
            chatbotContainer.style.width = "90%";
            chatbotContainer.style.right = "5%";
            chatbotContainer.style.bottom = "80px";
            chatbotContainer.style.height = "70vh";
        } else {
            chatbotContainer.style.width = "350px";
            chatbotContainer.style.right = "30px";
            chatbotContainer.style.bottom = "100px";
            chatbotContainer.style.height = "500px";
        }
    }

    window.addEventListener("resize", adjustChatbotForScreenSize);
    adjustChatbotForScreenSize();

});
