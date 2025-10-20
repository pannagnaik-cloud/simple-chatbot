document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearBtn = document.getElementById('clearChat');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAbout = document.getElementById('closeAbout');
    const voiceBtn = document.getElementById('voiceBtn');
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Conversation context
    let conversationContext = {
        userName: null,
        lastTopic: null,
        messageHistory: []
    };
    
    // Enhanced response patterns
    const responses = {
        greetings: [
            "Hello! How are you today?",
            "Hi there! Nice to meet you!",
            "Hey! What's on your mind?",
            "Greetings! How can I help you?",
            "Hello! It's great to chat with you!"
        ],
        howAreYou: [
            "I'm doing great, thanks for asking! I'm an AI chatbot developed by Pannag, so I don't have feelings, but I'm here to help!",
            "I'm functioning perfectly! How about you?",
            "I'm doing well! I hope you're having a great day too!",
            "I'm excellent! Ready to assist you with anything you need."
        ],
        developer: [
            "I was developed by Pannag, a talented developer with expertise in AI and web technologies. Pannag created me to demonstrate advanced conversational AI capabilities.",
            "My developer is Pannag, who has expertise in creating advanced AI systems and interactive web applications.",
            "I'm a product of Pannag's development skills. They're passionate about creating intelligent and user-friendly AI experiences.",
            "The developer Pannag built me using modern web technologies and AI techniques to provide helpful conversations."
        ],
        name: [
            "I'm Advanced ChatBot! I was developed by Pannag, and I'm here to chat with you and help answer your questions.",
            "You can call me ChatBot! I'm an AI assistant developed by Pannag.",
            "I don't have a specific name, but you can call me whatever you like! I was developed by Pannag.",
            "I'm just a chatbot, but I'm happy to be your friend! I was developed by Pannag."
        ],
        help: [
            "I can help with conversations, answer questions, do math calculations, convert units, define words, tell jokes, and more! Just ask me anything you'd like to know.",
            "I'm here to assist you with various tasks! You can ask me about math, definitions, time, weather, or just have a friendly conversation.",
            "I can help with many topics including calculations, conversions, information lookup, and general conversation. What would you like to know?",
            "I'm your AI assistant! I can answer questions, perform calculations, help with definitions, and engage in conversations on various topics."
        ],
        weather: [
            "I don't have access to real-time weather data, but you can check your local weather app or look outside for current conditions!",
            "For current weather information, please check a weather service like Weather.com or your phone's weather app.",
            "I can't check the weather right now, but I hope it's pleasant where you are! Is there something else I can help with?"
        ],
        time: [
            `The current time is ${new Date().toLocaleTimeString()}.`,
            `It's ${new Date().toLocaleTimeString()} right now.`,
            `Time check: ${new Date().toLocaleTimeString()}`
        ],
        date: [
            `Today is ${new Date().toLocaleDateString()}.`,
            `The date is ${new Date().toLocaleDateString()}.`,
            `It's ${new Date().toLocaleDateString()} today.`
        ],
        jokes: [
            "Why don't scientists trust atoms? Because they make up everything!",
            "What do you call a fake noodle? An impasta!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "Why couldn't the bicycle stand up by itself? It was two tired!",
            "What do you call a fish wearing a bowtie? Sofishticated!",
            "Why did the math book look so sad? Because it had too many problems!"
        ],
        default: [
            "That's interesting! Tell me more.",
            "I'm not sure how to respond to that. Could you try rephrasing?",
            "Hmm, I'm still learning. Could you ask me something else?",
            "I don't understand. Can you try a different question?",
            "That's a good question! Let me think about that...",
            "I'm not sure I can help with that, but I'm here to chat!",
            "Interesting! What else would you like to know?",
            "I'm not familiar with that topic. Could you provide more context?"
        ]
    };
    
    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process message for code blocks, links, etc.
        const processedMessage = processMessageContent(message);
        messageContent.innerHTML = processedMessage;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        // Add reaction buttons for bot messages
        if (!isUser) {
            const reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions';
            
            const likeBtn = document.createElement('button');
            likeBtn.className = 'reaction-btn';
            likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i>';
            likeBtn.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-thumbs-up"></i>';
                this.style.color = 'var(--primary-color)';
            });
            
            reactionsDiv.appendChild(likeBtn);
            messageDiv.appendChild(reactionsDiv);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to message history
        conversationContext.messageHistory.push({
            content: message,
            isUser: isUser,
            timestamp: new Date()
        });
        
        // Keep only the last 10 messages in history
        if (conversationContext.messageHistory.length > 10) {
            conversationContext.messageHistory.shift();
        }
    }
    
    // Process message content for special formatting
    function processMessageContent(message) {
        // Simple code block detection
        let processedMessage = message.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
        
        // Simple link detection
        processedMessage = processedMessage.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" class="link">$1</a>'
        );
        
        // Convert newlines to <br>
        processedMessage = processedMessage.replace(/\n/g, '<br>');
        
        return `<p>${processedMessage}</p>`;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    // Get bot response with enhanced logic
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for developer questions
        if (message.includes('developer') || message.includes('who made you') || 
            message.includes('who created you') || message.includes('who built you') ||
            message.includes('pannag')) {
            return getRandomResponse(responses.developer);
        }
        
        // Check for greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
            message.includes('greetings') || message.includes('good morning') || 
            message.includes('good afternoon') || message.includes('good evening')) {
            return getRandomResponse(responses.greetings);
        }
        
        // Check for "how are you" questions
        if (message.includes('how are you') || message.includes('how are you doing') || 
            message.includes('how do you do')) {
            return getRandomResponse(responses.howAreYou);
        }
        
        // Check for name questions
        if (message.includes('your name') || message.includes('who are you') || 
            message.includes('what are you') || message.includes('what should i call you')) {
            return getRandomResponse(responses.name);
        }
        
        // Check for help requests
        if (message.includes('help') || message.includes('what can you do') || 
            message.includes('assist') || message.includes('capabilities')) {
            return getRandomResponse(responses.help);
        }
        
        // Check for weather questions
        if (message.includes('weather') || message.includes('rain') || 
            message.includes('sunny') || message.includes('temperature') || 
            message.includes('forecast')) {
            return getRandomResponse(responses.weather);
        }
        
        // Check for time questions
        if (message.includes('time') || message.includes('clock') || 
            message.includes('what time')) {
            return getRandomResponse(responses.time);
        }
        
        // Check for date questions
        if (message.includes('date') || message.includes('day') || 
            message.includes('today') || message.includes('what day') || 
            message.includes('what is today')) {
            return getRandomResponse(responses.date);
        }
        
        // Check for joke requests
        if (message.includes('joke') || message.includes('funny') || 
            message.includes('make me laugh') || message.includes('tell me a joke')) {
            return getRandomResponse(responses.jokes);
        }
        
        // Check for math calculations
        if (message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/)) {
            return calculateMath(message);
        }
        
        // Check for unit conversions
        if (message.includes('convert') || message.includes('conversion')) {
            return handleUnitConversion(message);
        }
        
        // Check for definition requests
        if (message.includes('define') || message.includes('definition of') || 
            message.includes('what does') && message.includes('mean')) {
            return handleDefinitionRequest(message);
        }
        
        // Check for thanks
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Check for goodbye
        if (message.includes('bye') || message.includes('goodbye') || 
            message.includes('see you') || message.includes('later') || 
            message.includes('have a nice day')) {
            return "Goodbye! It was nice chatting with you. Come back anytime!";
        }
        
        // Check for user name introduction
        if (message.includes('my name is') || message.includes('i am') || message.includes("i'm")) {
            const nameMatch = message.match(/(?:my name is|i am|i'm)\s+([a-zA-Z]+)/i);
            if (nameMatch) {
                conversationContext.userName = nameMatch[1];
                return `Nice to meet you, ${conversationContext.userName}! How can I help you today?`;
            }
        }
        
        // Check if user is asking about the bot's name
        if (conversationContext.userName && message.includes(conversationContext.userName.toLowerCase())) {
            return `Yes, ${conversationContext.userName}? How can I assist you?`;
        }
        
        // Default response
        return getRandomResponse(responses.default);
    }
    
    // Calculate math expressions
    function calculateMath(message) {
        const match = message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (match) {
            const num1 = parseFloat(match[1]);
            const operator = match[2];
            const num2 = parseFloat(match[3]);
            let result;
            
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    result = num2 !== 0 ? num1 / num2 : "undefined (division by zero)";
                    break;
                default:
                    return "I couldn't calculate that expression.";
            }
            
            return `The result of ${num1} ${operator} ${num2} is ${result}.`;
        }
        
        return "I couldn't find a valid math expression to calculate.";
    }
    
    // Handle unit conversions
    function handleUnitConversion(message) {
        // Simple conversion examples
        if (message.includes('celsius') && message.includes('fahrenheit')) {
            return "To convert Celsius to Fahrenheit: multiply by 9/5 and add 32. To convert Fahrenheit to Celsius: subtract 32 and multiply by 5/9.";
        }
        
        if (message.includes('kilometers') && message.includes('miles')) {
            return "To convert kilometers to miles: multiply by 0.621371. To convert miles to kilometers: multiply by 1.60934.";
        }
        
        if (message.includes('kilograms') && message.includes('pounds')) {
            return "To convert kilograms to pounds: multiply by 2.20462. To convert pounds to kilograms: multiply by 0.453592.";
        }
        
        if (message.includes('meters') && message.includes('feet')) {
            return "To convert meters to feet: multiply by 3.28084. To convert feet to meters: multiply by 0.3048.";
        }
        
        return "I can help with various unit conversions like temperature (Celsius/Fahrenheit), distance (km/miles), weight (kg/pounds), and length (meters/feet). Please specify which conversion you need.";
    }
    
    // Handle definition requests
    function handleDefinitionRequest(message) {
        // Extract the word to define
        let wordMatch = message.match(/(?:define|definition of|what does)\s+([a-zA-Z]+)/i);
        if (!wordMatch) {
            wordMatch = message.match(/what\s+([a-zA-Z]+)\s+mean/i);
        }
        
        if (wordMatch) {
            const word = wordMatch[1].toLowerCase();
            
            // Simple dictionary
            const definitions = {
                "ai": "Artificial Intelligence is the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.",
                "bot": "A bot is a software application that runs automated tasks (scripts) over the Internet, typically performing tasks that are simple and repetitive.",
                "chatbot": "A chatbot is a software application used to conduct an on-line chat conversation via text or text-to-speech, in lieu of providing direct contact with a live human agent.",
                "algorithm": "An algorithm is a process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.",
                "programming": "Programming is the process of creating a set of instructions that tell a computer how to perform a task."
            };
            
            if (definitions[word]) {
                return `**${word.charAt(0).toUpperCase() + word.slice(1)}**: ${definitions[word]}`;
            } else {
                return `I don't have a definition for "${word}" in my knowledge base. You might want to check a dictionary for that word.`;
            }
        }
        
        return "I can help define technical terms related to programming, AI, and web development. What word would you like me to define?";
    }
    
    // Get random response from array
    function getRandomResponse(responseArray) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        messageInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Get and add bot response after a delay
        setTimeout(() => {
            typingIndicator.remove();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, false);
            
            // Update conversation context
            conversationContext.lastTopic = message;
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
    
    // Clear chat
    clearBtn.addEventListener('click', function() {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <p>Hello! I'm an advanced AI chatbot developed by Pannag. I can help with conversations, answer questions, do calculations, and much more. What would you like to talk about today?</p>
                </div>
                <span class="message-time">Just now</span>
            </div>
        `;
        
        // Reset conversation context
        conversationContext = {
            userName: null,
            lastTopic: null,
            messageHistory: []
        };
    });
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'true');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // Show about modal
    aboutBtn.addEventListener('click', function() {
        aboutModal.style.display = 'flex';
    });
    
    // Close about modal
    closeAbout.addEventListener('click', function() {
        aboutModal.style.display = 'none';
    });
    
    // Close about modal when clicking outside
    aboutModal.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
    // Voice input (basic implementation)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            chatForm.dispatchEvent(new Event('submit'));
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };
        
        voiceBtn.addEventListener('click', function() {
            recognition.start();
            this.innerHTML = '<i class="fas fa-stop"></i>';
            this.style.color = 'var(--danger-color)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-microphone"></i>';
                this.style.color = '';
            }, 5000);
        });
    } else {
        voiceBtn.style.display = 'none';
    }
    
    // Focus input on load
    messageInput.focus();
    
    // Allow sending message with Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
});
