// Chatbot JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearBtn = document.getElementById('clearChat');

    // Predefined responses
    const responses = {
        greetings: [
            "Hello! How can I assist you today?",
            "Hi there! What can I do for you?",
            "Greetings! I'm here to help.",
            "Hey! How's it going?"
        ],
        help: [
            "I can help you with general questions, provide information, or just chat! Try asking me about the weather, time, or any general topic.",
            "I'm your AI assistant. You can ask me questions, and I'll do my best to help!",
            "I can answer questions, provide information, and have conversations with you. What would you like to know?"
        ],
        weather: [
            "I don't have real-time weather data, but you can check your local weather app or website for current conditions!",
            "For current weather information, please check a weather service like Weather.com or your local weather station.",
            "I don't have access to live weather data. Try asking a voice assistant or checking a weather app!"
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
        default: [
            "I'm not sure how to respond to that. Could you try rephrasing?",
            "That's interesting! Tell me more.",
            "I'm still learning. Could you ask me something else?",
            "I don't understand. Can you try a different question?",
            "Hmm, I'm not sure what to say to that. What else would you like to know?"
        ]
    };

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${message}</p>`;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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

    // Get bot response
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
            return getRandomResponse(responses.greetings);
        }
        
        // Check for help requests
        if (message.includes('help') || message.includes('what can you do') || message.includes('assist')) {
            return getRandomResponse(responses.help);
        }
        
        // Check for weather questions
        if (message.includes('weather') || message.includes('rain') || message.includes('sunny')) {
            return getRandomResponse(responses.weather);
        }
        
        // Check for time questions
        if (message.includes('time') || message.includes('clock')) {
            return getRandomResponse(responses.time);
        }
        
        // Check for date questions
        if (message.includes('date') || message.includes('day') || message.includes('today')) {
            return getRandomResponse(responses.date);
        }
        
        // Check for name questions
        if (message.includes('your name') || message.includes('who are you')) {
            return "I'm ChatBot, your AI assistant. I'm here to help answer your questions and have conversations with you!";
        }
        
        // Check for thanks
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Check for goodbye
        if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
            return "Goodbye! Have a great day! Feel free to come back anytime if you need help.";
        }
        
        // Default response
        return getRandomResponse(responses.default);
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
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });

    // Clear chat
    clearBtn.addEventListener('click', function() {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <p>Hello! I'm your AI assistant. How can I help you today?</p>
                </div>
                <span class="message-time">Just now</span>
            </div>
        `;
    });

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
