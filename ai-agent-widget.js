function initAIAgent() {
    if (document.getElementById('ai-agent-widget')) return;

    // Inject Widget HTML
    const widgetHTML = `
        <div id="ai-agent-widget" class="premium-design">
            <!-- Floating Launcher -->
            <div class="ai-launcher-wrapper">
                <div class="launcher-tooltip">Ask me anything</div>
                <button id="ai-agent-btn" class="ai-launcher" aria-label="Open AI Assistant">
                    <div class="launcher-glow"></div>
                    <div class="launcher-avatar">
                        <i class="fa-solid fa-robot"></i>
                        <div class="online-dot"></div>
                    </div>
                    <div class="launcher-badge">Milan AI</div>
                </button>
            </div>
            
            <!-- Main Chat Window -->
            <div id="ai-chat-window" class="ai-window">
                <!-- Sidebar -->
                <div class="ai-sidebar">
                    <button class="sidebar-item" data-query="About Milan"><i class="fa-solid fa-user"></i> About Milan</button>
                    <button class="sidebar-item" data-query="Skills"><i class="fa-solid fa-code"></i> Skills</button>
                    <button class="sidebar-item" data-query="AI Journey"><i class="fa-solid fa-brain"></i> AI Journey</button>
                    <button class="sidebar-item" data-query="Data Analytics"><i class="fa-solid fa-chart-simple"></i> Data Analytics</button>
                    <button class="sidebar-item" data-query="Projects"><i class="fa-solid fa-rocket"></i> Projects</button>
                    <button class="sidebar-item" data-query="Certificates"><i class="fa-solid fa-trophy"></i> Certificates</button>
                    <button class="sidebar-item" data-query="Education"><i class="fa-solid fa-graduation-cap"></i> Education</button>
                    <button class="sidebar-item" data-query="Resume"><i class="fa-solid fa-file-lines"></i> Resume</button>
                    <button class="sidebar-item" data-query="Career Goals"><i class="fa-solid fa-bullseye"></i> Career Goals</button>
                    <button class="sidebar-item" data-query="Gujarat"><i class="fa-solid fa-location-dot"></i> Gujarat</button>
                    
                    <div class="sidebar-footer">
                        <div class="sidebar-ask-anything">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <div class="ask-text">
                                <strong>Ask anything</strong>
                                <span>I'm here to help!</span>
                            </div>
                            <i class="fa-solid fa-chevron-right arrow"></i>
                        </div>
                    </div>
                </div>

                <!-- Main Chat Area -->
                <div class="ai-main">
                    <!-- Header -->
                    <div class="ai-header">
                        <div class="header-info">
                            <div class="header-avatar">
                                <i class="fa-solid fa-robot"></i>
                                <div class="online-dot"></div>
                            </div>
                            <div class="header-text">
                                <h3>Milan AI <i class="fa-solid fa-wand-magic-sparkles"></i></h3>
                                <span>Portfolio Intelligence Agent</span>
                                <div class="status"><span class="dot"></span> Online</div>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button id="chat-minimize"><i class="fa-solid fa-minus"></i></button>
                            <button id="chat-expand"><i class="fa-solid fa-expand"></i></button>
                            <button id="chat-close"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>

                    <!-- Chat Body -->
                    <div class="chat-body" id="chat-body">
                        <!-- Welcome Card -->
                        <div class="welcome-card">
                            <h4>👋 Hi! I'm Milan's AI Portfolio Assistant.</h4>
                            <p>Ask me anything about Milan's skills, projects, AI journey, data analytics experience, education, certificates, resume, GitHub, LinkedIn, or career interests.</p>
                            <div class="welcome-bg-graphic"></div>
                        </div>
                        <div class="time-stamp">Just now</div>
                    </div>

                    <!-- Quick Actions Row -->
                    <div class="quick-actions-row">
                        <button class="quick-action-btn" data-query="Show Projects">🚀 Show Projects</button>
                        <button class="quick-action-btn" data-query="Resume">📄 Resume</button>
                        <button class="quick-action-btn" data-query="Certificates">🏆 Certificates</button>
                        <button class="quick-action-btn" data-query="Gujarat Opportunities">📍 Gujarat Opportunities</button>
                    </div>

                    <!-- Footer Input Area -->
                    <div class="ai-footer">
                        <div class="input-container">
                            <input type="text" id="chat-input" placeholder="Ask Milan AI anything..." autocomplete="off">
                            <div class="input-actions-left">
                                <button class="icon-btn" aria-label="Attachment"><i class="fa-solid fa-paperclip"></i></button>
                                <button class="icon-btn" aria-label="Microphone"><i class="fa-solid fa-microphone"></i></button>
                                <button class="icon-btn" aria-label="Magic"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
                            </div>
                            <button id="chat-send" class="send-btn" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Elements
    const btn = document.getElementById('ai-agent-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatExpand = document.getElementById('chat-expand');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');
    const quickActions = document.querySelectorAll('.quick-action-btn');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const askAnythingBtn = document.querySelector('.sidebar-ask-anything');

    // API URL
    const API_URL = window.__MILAN_AI_API_URL__ || '/api/chat';

    // Show launcher tooltip after a delay
    setTimeout(() => {
        if (!chatWindow.classList.contains('open')) {
            document.querySelector('.launcher-tooltip').classList.add('show');
            setTimeout(() => {
                document.querySelector('.launcher-tooltip').classList.remove('show');
            }, 6000);
        }
    }, 2000);

    // Toggle Chat
    btn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        document.querySelector('.launcher-tooltip').classList.remove('show');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    });

    const navAiBtn = document.getElementById('nav-ai-btn');
    if (navAiBtn) {
        navAiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatWindow.classList.add('open');
            document.querySelector('.launcher-tooltip').classList.remove('show');
            chatInput.focus();
        });
    }

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });
    
    chatMinimize.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    chatExpand.addEventListener('click', () => {
        chatWindow.classList.toggle('expanded');
    });

    // Ask Anything Focus
    askAnythingBtn.addEventListener('click', () => {
        chatInput.focus();
    });



    // Local Fallback Responses
    const localResponses = {
        "About Milan": "I am a passionate Python Developer, AI Engineer, and Data Analyst based in Gujarat, India. I specialize in building intelligent software and transforming data into actionable insights.",
        "Skills": "### Python Development\n- Python\n- Django\n- Flask\n\n### AI & ML\n- Machine Learning\n- NLP\n- LLMs\n\n### Data Analytics\n- SQL (SQLite, PostgreSQL)\n- Pandas\n- NumPy\n- Data Visualization",
        "AI Journey": "My AI journey started with a deep fascination for data. I've since built numerous projects using Machine Learning and Large Language Models, focusing on real-world applications.",
        "Data Analytics": "I have strong experience in Data Analytics, using SQL and Python (Pandas, NumPy) to clean, process, and extract meaningful insights from complex datasets.",
        "Projects": "I have several key projects including:\n- **AI Agent Portfolio**: This very widget!\n- **Data Pipeline**: Automated data processing.\n- **Machine Learning Classifier**: A predictive model.\n\nClick [Show Projects](#projects) to see more.",
        "Certificates": "I hold several certifications in Python, Data Science, and AI. You can view my full list of achievements in the [Certificates](#certificates) section.",
        "Education": "I have a B.Sc. in Information Technology, where I built a strong foundation in computer science, software engineering, and database management.",
        "Resume": "You can download my latest resume from the [Resume](#resume) section to see a detailed breakdown of my experience and skills.",
        "Career Goals": "I am actively seeking roles as a Python Developer, AI Engineer, or Data Analyst in Gujarat, India, or remote positions where I can build intelligent, data-driven solutions.",
        "Gujarat": "I am based in Gujarat, India, and I am highly interested in contributing to the growing tech ecosystem here, whether on-site or hybrid.",
        "Show Projects": "Navigating to Projects! Please check the main portfolio page.",
        "Gujarat Opportunities": "I'm open to opportunities in Gujarat! Feel free to reach out via the contact form."
    };

    // Send Message
    const sendMessage = async (message) => {
        if (!message.trim()) return;

        // Add user message to UI
        appendMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error("API Offline");
            }

            const data = await response.json();
            removeTypingIndicator(typingId);
            appendMessage(data.answer, 'ai');
            
        } catch (error) {
            console.warn('API Error, using local fallback:', error);
            removeTypingIndicator(typingId);

            // Determine best local response
            let fallbackText = "I'm currently running in offline mode. Please [contact Milan](#contact) directly for more information!";
            for (const key in localResponses) {
                if (message.toLowerCase().includes(key.toLowerCase())) {
                    fallbackText = localResponses[key];
                    break;
                }
            }
            
            // Add a slight delay for realism
            setTimeout(() => {
                appendMessage(fallbackText, 'ai');
            }, 600);
        }
    };

    // Events for sending
    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput.value);
        }
    });

    // Sidebar & Quick Actions
    const handleQueryClick = (e) => {
        const query = e.currentTarget.getAttribute('data-query');
        if(!query) return;
        
        // Remove active class from all sidebar items
        sidebarItems.forEach(item => item.classList.remove('active'));
        if (e.currentTarget.classList.contains('sidebar-item')) {
            e.currentTarget.classList.add('active');
        }

        sendMessage(query);
    };

    quickActions.forEach(btn => btn.addEventListener('click', handleQueryClick));
    sidebarItems.forEach(btn => btn.addEventListener('click', handleQueryClick));

    // Input Action Icons (Mic, Attachment, Magic)
    const inputIcons = document.querySelectorAll('.icon-btn');
    inputIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const label = icon.getAttribute('aria-label');
            showToast(`${label} feature is coming soon!`);
        });
    });

    // Helpers
    function showToast(message) {
        let toast = document.querySelector('.ai-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'ai-toast';
            chatWindow.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
    function appendMessage(text, sender) {
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `message-wrapper ${sender}`;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        if (sender === 'ai') {
            const iconWrap = document.createElement('div');
            iconWrap.className = 'msg-icon';
            iconWrap.innerHTML = '<i class="fa-solid fa-robot"></i>';
            msgWrapper.appendChild(iconWrap);
        }

        // Advanced markdown parsing for structured responses
        let formattedText = text
            // Parse custom skill groups e.g. "Python Development:" or "### Python Development"
            .replace(/#{1,3}\s+(.*)/g, '<h5>$1</h5>') 
            // Parse bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Parse links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Parse list items with chips format (if AI outputs bullet lists for skills)
            .replace(/-\s+([^\n]+)/g, '<span class="skill-chip-inline">$1</span>');
        
        // Clean up breaks
        formattedText = formattedText.replace(/\n\n/g, '<div class="msg-break"></div>');
        formattedText = formattedText.replace(/\n/g, '');

        msgDiv.innerHTML = formattedText;
        
        if (sender === 'ai') {
            // Add action icons at bottom of AI response
            const msgActions = document.createElement('div');
            msgActions.className = 'msg-actions';
            msgActions.innerHTML = `
                <button class="action-thumb-up"><i class="fa-regular fa-thumbs-up"></i></button>
                <button class="action-thumb-down"><i class="fa-regular fa-thumbs-down"></i></button>
                <button class="action-copy"><i class="fa-regular fa-copy"></i></button>
                <button class="action-share"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
            `;
            msgDiv.appendChild(msgActions);

            // Wire up action buttons
            const copyBtn = msgActions.querySelector('.action-copy');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(text);
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>', 2000);
            });

            const upBtn = msgActions.querySelector('.action-thumb-up');
            upBtn.addEventListener('click', () => {
                upBtn.innerHTML = '<i class="fa-solid fa-thumbs-up" style="color:var(--ai-primary)"></i>';
            });

            const downBtn = msgActions.querySelector('.action-thumb-down');
            downBtn.addEventListener('click', () => {
                downBtn.innerHTML = '<i class="fa-solid fa-thumbs-down" style="color:red"></i>';
            });
            const shareBtn = msgActions.querySelector('.action-share');
            shareBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href);
                shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                showToast('Link copied to clipboard!');
                setTimeout(() => shareBtn.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>', 2000);
            });
        }
        
        if (sender === 'user') {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'msg-time user-time';
            timeDiv.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            msgDiv.appendChild(timeDiv);
            const ticks = document.createElement('span');
            ticks.className = 'msg-ticks';
            ticks.innerHTML = '<i class="fa-solid fa-check-double"></i>';
            timeDiv.appendChild(ticks);
        } else {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'msg-time ai-time';
            timeDiv.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            msgDiv.appendChild(timeDiv);
        }

        msgWrapper.appendChild(msgDiv);
        chatBody.appendChild(msgWrapper);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = id;
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAgent);
} else {
    initAIAgent();
}
