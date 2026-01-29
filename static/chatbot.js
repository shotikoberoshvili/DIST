document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('close-chatbot');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendButton = document.getElementById('send-message-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    // Simple responses for exact matches
    const responses = {
        'გამარჯობა': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'gamarjoba': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'hello': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'Hello': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'Hi': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'hi': 'გამარჯობა! რით შემიძლია დაგეხმარო?',
        'როგორ ხარ': 'მე ვარ ციფრული ასისტენტი, მზად ვარ დაგეხმარო! შენ როგორ ხარ?',
        'როგორ ხარ?': 'მე ვარ ციფრული ასისტენტი, მზად ვარ დაგეხმარო! შენ როგორ ხარ?',
        'კარგად': 'მშვენიერია! რით შემიძლია დაგეხმარო?',
        'კარგად ვარ': 'მშვენიერია! რით შემიძლია დაგეხმარო?',
        'მადლობა': 'არაფრის, სიამოვნებით! კიდევ რამე დაგვჭირდება?',
        'მადლობა!': 'არაფრის, სიამოვნებით! კიდევ რამე დაგვჭირდება?',
        'არა': 'კარგი, თუ რამე დაგჭირდება, მზად ვარ დაგეხმარო!',
        'არა, მადლობა': 'კარგი, თუ რამე დაგჭირდება, მზად ვარ დაგეხმარო!',
        'bye': 'ნახვამდის! კარგი დღე გისურვებ!',
        'ნახვამდის': 'ნახვამდის! კარგი დღე გისურვებ!'
    };

    // Enhanced knowledge base with all DroPay information
    const knowledgeBase = {
        // Basic greetings and responses
        'გამარჯობა|hello|hi|სალამი': {
            response: 'გამარჯობა! მე ვარ DroPay-ის ჩათბოტი. როგორ შემიძლია დაგეხმაროთ?',
            options: [
                'რა არის DroPay?',
                'როგორ მუშაობს?',
                'რა გადახდებია ნებადართული?',
                'რა არის DroPay Plus?'
            ]
        },
        'როგორ ხარ|როგორ ხარ?': {
            response: 'მე ვარ DroPay-ის ციფრული ასისტენტი, მზად ვარ დაგეხმაროთ! თქვენ როგორ ხართ?',
            options: [
                'კარგად ვარ',
                'რა არის DroPay?',
                'როგორ მუშაობს?'
            ]
        },
        'კარგად|კარგად ვარ': {
            response: 'მშვენიერია! რა ინფორმაცია გაინტერესებთ DroPay-ის შესახებ?',
            options: [
                'რა არის DroPay?',
                'როგორ მუშაობს მონეტიზაცია?',
                'რა ლიმიტები მაქვს?'
            ]
        },

        // Core DroPay information
        'რა არის DroPay|რაა dropay|რა არის dropay': {
            response: 'DroPay არის სასწრაფო გადახდის მოთხოვნის სერვისი, რომელიც საშუალებას გაძლევთ გაგზავნოთ გადახდის მოთხოვნები სწრაფად და მარტივად.',
            options: [
                'როგორ მუშაობს?',
                'რა გადახდებია ნებადართული?',
                'რა არის DroPay Plus?'
            ]
        },
        'როგორ მუშაობს|როგორ ვიყენებ': {
            response: 'DroPay-ის გამოყენება ძალიან მარტივია:\n1. შეავსეთ გადახდის მოთხოვნის ფორმა\n2. დააჭირეთ "გაგზავნა"\n3. მიმღები მიიღებს ბმულს გადახდისთვის\n4. გადახდა დასრულდება რამდენიმე წუთში',
            options: [
                'რა გადახდებია ნებადართული?',
                'რამდენი დრო სჭირდება?',
                'რა საკომისიოა?'
            ]
        },

        // Monetization and fees
        'როგორ მუშაობს DroPay-ის მონეტიზაცია|როგორ ფულს გამოიმუშავებთ|როგორ მუშაობს მონეტიზაცია': {
            response: 'DroPay-ის მონეტიზაცია მუშაობს ჰიბრიდული მოდელით:\n1) ტრანზაქციული საკომისიო 1.5%-2.5% (მინიმუმ 2 ლარი)\n2) პრემიუმ წევრობა DroPay Plus\n3) სტრატეგიული პარტნიორობები ბანკებთან',
            options: [
                'რა არის DroPay Plus?',
                'რა საკომისიოს იხდით?',
                'როგორ მუშაობთ ბანკებთან?'
            ]
        },
        'რა საკომისიოა|რა საკომისიო აქვს|რამდენი საკომისიოა|რა საკომისიოს იხდით': {
            response: 'ჩვეულებრივი მომხმარებლები იხდიან 1.5%-2.5% საკომისიოს ყოველ ტრანზაქციაზე (მინიმუმ 2 ლარი). პრემიუმ წევრებს აქვთ შემცირებული ან ნულოვანი საკომისიო.',
            options: [
                'რა არის DroPay Plus?',
                'როგორ შემიძლია ლიმიტის გაზრდა?',
                'რა ლიმიტები მაქვს?'
            ]
        },
        'რა არის DroPay Plus': {
            response: 'DroPay Plus არის პრემიუმ წევრობა (9.99 ლარი/თვეში ან 99.99 ლარი/წელიწადში), რომელიც გთავაზობთ:\n• ნულოვან/დაბალ საკომისიოს\n• გაზრდილ ლიმიტებს\n• პრიორიტეტულ მომსახურებას\n• ადრეულ წვდომას ახალ ფუნქციებზე',
            options: [
                'როგორ შემიძლია ლიმიტის გაზრდა?',
                'რა ლიმიტები მაქვს?',
                'როგორ აფასებთ სანდოობას?'
            ]
        },

        // Limits and credit system
        'როგორ განისაზღვრება ჩემი ლიმიტი|რა ლიმიტები მაქვს': {
            response: 'ლიმიტი განისაზღვრება თქვენი სანდოობის რეიტინგით. ახალი მომხმარებლებისთვის საწყისი ლიმიტია 50-200 ლარი. დროული დაფარვები ზრდის ლიმიტს 1000-2000 ლარამდე ან მეტზე.',
            options: [
                'როგორ შემიძლია ლიმიტის გაზრდა?',
                'რა მოხდება თუ ვერ დავაფარებ?',
                'როგორ აფასებთ სანდოობას?'
            ]
        },
        'რამდენი დრო მაქვს გადახდისთვის|რამდენი დრო სჭირდება|როდის მოვა თანხა': {
            response: 'სტანდარტული დაბრუნების ვადაა 3-5 სამუშაო დღე. პრემიუმ წევრებს შეიძლება ჰქონდეთ მოქნილი ვადები ან გახანგრძლივების შესაძლებლობა. გადახდის დამუშავებას სჭირდება 5-15 წუთი.',
            options: [
                'რა მოხდება თუ ვერ დავაფარებ?',
                'რა არის DroPay Plus?',
                'როგორ შემიძლია ლიმიტის გაზრდა?'
            ]
        },
        'რა მოხდება თუ ვერ დავაფარებ': {
            response: 'გადახდის დაგვიანებისას:\n1) მოგივათ შეხსენებები\n2) დაირიცხება დამატებითი საკომისიო (1 ლარი/დღე)\n3) 7 დღის შემდეგ ანგარიში დროებით დაიბლოკება\n4) შემცირდება თქვენი სანდოობის რეიტინგი',
            options: [
                'როგორ შემიძლია ლიმიტის გაზრდა?',
                'როგორ აფასებთ სანდოობას?',
                'რა არის DroPay Plus?'
            ]
        },
        'როგორ შემიძლია ლიმიტის გაზრდა': {
            response: 'დროულად დაფარეთ თქვენი ტრანზაქციები და გამოიყენეთ DroPay რეგულარულად. ეს ავტომატურად გაზრდის თქვენს სანდოობის რეიტინგს და ლიმიტს.',
            options: [
                'როგორ აფასებთ სანდოობას?',
                'რა არის DroPay Plus?',
                'რა ლიმიტები მაქვს?'
            ]
        },

        // Security and trust system
        'როგორ აფასებთ სანდოობას': {
            response: 'ჩვენი AI სისტემა აფასებს:\n1) გადახდების ისტორიას\n2) ტრანზაქციულ აქტივობას\n3) იდენტიფიკაციის დონეს (KYC/AML)\n4) საკრედიტო ისტორიას (თანხმობის შემთხვევაში)',
            options: [
                'რა არის KYC/AML?',
                'უსაფრთხოა თუ არა DroPay?',
                'როგორ შემიძლია ლიმიტის გაზრდა?'
            ]
        },
        'რა არის KYC/AML': {
            response: 'ეს არის მომხმარებლის იდენტიფიკაციის (Know Your Customer) და ფულის გათეთრების თავიდან აცილების (Anti-Money Laundering) პროცესები, რომლებიც სავალდებულოა ფინანსური უსაფრთხოებისთვის.',
            options: [
                'უსაფრთხოა თუ არა DroPay?',
                'როგორ აფასებთ სანდოობას?',
                'როგორ მუშაობთ ბანკებთან?'
            ]
        },
        'უსაფრთხოა თუ არა DroPay': {
            response: 'დიახ, DroPay იყენებს ბანკების სტანდარტების შესაბამის დაცვის ღონისძიებებს, მათ შორის ორფაქტორიან ავთენტიფიკაციას და დაშიფვრის უახლეს ტექნოლოგიებს.',
            options: [
                'რა არის KYC/AML?',
                'როგორ მუშაობთ ბანკებთან?',
                'რა გადახდებია ნებადართული?'
            ]
        },

        // Partnerships and future plans
        'როგორ მუშაობთ ბანკებთან': {
            response: 'ვითანამშრომლებთ ქართულ ბანკებთან Open Banking API-ს საშუალებით, შემოსავლის გაზიარების ან სპეციალური საკომისიო შეთანხმებებით.',
            options: [
                'რომელ ბანკებთან მუშაობთ?',
                'გეგმავთ B2B მომსახურებებს?',
                'რა გადახდებია ნებადართული?'
            ]
        },
        'გეგმავთ B2B მომსახურებებს': {
            response: 'დიახ, მომავალში ჩავატარებთ კორპორატიულ მომსახურებებს კომპანიებისთვის, რათა გავამარტივოთ სასწრაფო გადახდები თანამშრომლებისთვის.',
            options: [
                'როგორ მუშაობთ ბანკებთან?',
                'რა არის DroPay Plus?',
                'როგორ მუშაობს მონეტიზაცია?'
            ]
        },
        'რომელ ბანკებთან მუშაობთ': {
            response: 'ჩვენ ვთანამშრომლობთ ყველა მთავარ ქართულ ბანკთან. კონკრეტული სია შეგიძლიათ იხილოთ ჩვენს ვებსაიტზე.',
            options: [
                'როგორ მუშაობთ ბანკებთან?',
                'რა გადახდებია ნებადართული?',
                'უსაფრთხოა თუ არა DroPay?'
            ]
        },

        // Basic service info
        'რა გადახდებია ნებადართული|რა გადახდები|რა ვალუტები': {
            response: 'ჩვენ ვიღებთ გადახდებს შემდეგ ვალუტებში:\n• ქართული ლარი (GEL)\n• ამერიკული დოლარი (USD)\n• ევრო (EUR)',
            options: [
                'რა საკომისიოა?',
                'როგორ დავრეგისტრირდე?',
                'რამდენი დრო სჭირდება?'
            ]
        },
        'როგორ დავრეგისტრირდე|რეგისტრაცია|როგორ შევქმნა ანგარიში': {
            response: 'რეგისტრაცია არ არის საჭირო DroPay-ის გამოსაყენებლად. ნებისმიერი ადამიანი შეძლებს გადახდის მოთხოვნის გაგზავნას.',
            options: [
                'რა არის DroPay?',
                'როგორ მუშაობს?',
                'რა ლიმიტები მაქვს?'
            ]
        }
    };

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        inputField.focus();
        
        if (!chatbotContainer.dataset.initialized) {
            chatbotContainer.dataset.initialized = 'true';
            addWelcomeMessage();
        }
    });

    closeBtn.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
    });

    // Add welcome message
    function addWelcomeMessage() {
        const welcomeMessage = 'გამარჯობა! მე ვარ DroPay-ის ჩათბოტი – აქ ვარ, რომ დაგეხმარო სასწრაფო გადახდებთან დაკავშირებით. როგორ შემიძლია დაგეხმაროთ?';
        const quickQuestions = [
            'რა არის DroPay?',
            'როგორ მუშაობს?',
            'რა არის DroPay Plus?',
            'რა ლიმიტები მაქვს?'
        ];
        
        addMessage(welcomeMessage, 'bot', quickQuestions);
    }

    // Send message function
    function sendMessage() {
        const message = inputField.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        inputField.value = '';

        typingIndicator.style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const botResponse = getBotResponse(message);
            addMessage(botResponse.text, 'bot', botResponse.suggestions);
        }, 500 + Math.random() * 1000);
    }

    // Add message to chat
    function addMessage(text, sender, suggestions = []) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';

        const message = document.createElement('div');
        message.className = `message ${sender}-message`;
        message.innerHTML = text.replace(/\n/g, '<br>');

        messageContainer.appendChild(message);

        if (suggestions.length > 0) {
            const chipsContainer = document.createElement('div');
            chipsContainer.className = 'suggestion-chips';

            suggestions.forEach(suggestion => {
                const chip = document.createElement('div');
                chip.className = 'suggestion-chip';
                chip.textContent = suggestion;
                chip.addEventListener('click', () => {
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

    // Get bot response with enhanced logic
    function getBotResponse(message) {
        const originalMessage = message.trim();
        const normalizedMessage = message.toLowerCase().trim();
        
        // First check for exact matches in simple responses
        if (responses[originalMessage]) {
            return {
                text: responses[originalMessage],
                suggestions: ['რა არის DroPay?', 'როგორ მუშაობს?', 'რა არის DroPay Plus?']
            };
        }
        
        // Handle thanks and goodbye responses
        if (normalizedMessage.includes('მადლობა') || normalizedMessage.includes('thanks') || normalizedMessage.includes('thank you')) {
            return {
                text: 'არაფრის, სიამოვნებით! კიდევ რამე დაგჭირდება DroPay-თან დაკავშირებით?',
                suggestions: ['რა არის DroPay Plus?', 'როგორ მუშაობს მონეტიზაცია?', 'რა ლიმიტები მაქვს?']
            };
        } else if (normalizedMessage.includes('ნახვამდის') || normalizedMessage.includes('bye') || normalizedMessage.includes('goodbye')) {
            return {
                text: 'ნახვამდის! გმადლობთ, რომ იყენებთ DroPay-ს! კარგი დღე გისურვებთ!',
                suggestions: []
            };
        } else if (normalizedMessage.includes('არა') && (normalizedMessage.includes('მადლობა') || normalizedMessage.length < 10)) {
            return {
                text: 'კარგი, თუ რამე დაგჭირდებათ DroPay-თან დაკავშირებით, მზად ვარ დაგეხმაროთ!',
                suggestions: ['რა არის DroPay?', 'როგორ მუშაობს?', 'რა არის DroPay Plus?']
            };
        }
        
        // Search through knowledge base with pattern matching
        for (const pattern in knowledgeBase) {
            const keywords = pattern.split('|');
            for (const keyword of keywords) {
                if (normalizedMessage.includes(keyword.toLowerCase())) {
                    return {
                        text: knowledgeBase[pattern].response,
                        suggestions: knowledgeBase[pattern].options || []
                    };
                }
            }
        }
        
        // Default response with helpful suggestions
        return {
            text: 'უკაცრავად, არ მესმის თქვენი კითხვა. გთხოვთ, სცადოთ სხვა ფორმულირება ან აირჩიოთ ერთ-ერთი ჩვენი სუგესტია:',
            suggestions: [
                'რა არის DroPay?',
                'როგორ მუშაობს მონეტიზაცია?',
                'რა არის DroPay Plus?',
                'რა ლიმიტები მაქვს?',
                'როგორ აფასებთ სანდოობას?'
            ]
        };
    }

    // Event listeners
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-chip')) {
            inputField.value = e.target.textContent;
            sendMessage();
        }
    });

    // Responsive adjustments
    function adjustChatbotForScreenSize() {
        if (window.innerWidth <= 768) {
            chatbotContainer.style.width = '90%';
            chatbotContainer.style.right = '5%';
            chatbotContainer.style.bottom = '80px';
            chatbotContainer.style.height = '70vh';
        } else {
            chatbotContainer.style.width = '350px';
            chatbotContainer.style.right = '30px';
            chatbotContainer.style.bottom = '100px';
            chatbotContainer.style.height = '500px';
        }
    }

    window.addEventListener('resize', adjustChatbotForScreenSize);
    adjustChatbotForScreenSize();
});