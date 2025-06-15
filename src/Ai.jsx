import React, { useState, useEffect } from 'react';
import './App.css';
import { assets } from './assets/assets';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CopyButton({ text }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <button className="copy-button" onClick={copyToClipboard}>
            Copy Text
        </button>
    );
}

function Ai() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [displayedAnswer, setDisplayedAnswer] = useState("");
    const [recentChats, setRecentChats] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function fetchAIContent() {
        setAnswer("Loading...");
        setDisplayedAnswer("Loading...");
        try {
            const response = await axios.post('http://localhost:5000/api/generate', { prompt: question });
            const generatedAnswer = response.data.answer;
            setAnswer(generatedAnswer);
            setDisplayedAnswer(generatedAnswer);
            setRecentChats(prev => [question, ...prev]);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            setAnswer("Error fetching data");
            setDisplayedAnswer("Error fetching data");
        }
    }

    useEffect(() => {
        let index = 0;
        let interval;
        if (answer && answer !== "Loading...") {
            setDisplayedAnswer("");
            interval = setInterval(() => {
                setDisplayedAnswer(prev => prev + answer[index]);
                index++;
                if (index === answer.length) clearInterval(interval);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [answer]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            fetchAIContent();
        }
    };

    const handleNewChat = () => {
        setQuestion("");
        setAnswer("");
        setDisplayedAnswer("");
    };

    return (
        <div className="container">
            {!isMobile && (
                <div className="sidebar">
                    <div className="top">
                        <div className="new-chat" onClick={handleNewChat}><p>New Chat</p></div>
                        <div className="recent">
                            <h2>Recent Chats</h2>
                            <ul>
                                {recentChats.map((chat, index) => <li key={index}>{chat}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="bottom-item"><img src={assets.question_icon} alt="" /><p>Help</p></div>
                        <div className="bottom-item"><img src={assets.history_icon} alt="" /><p>History</p></div>
                        <div className="bottom-item"><img src={assets.setting_icon} alt="" /><p>Setting</p></div>
                    </div>
                </div>
            )}

            <div className="main">
                <div className="nav">
                    <p><Link to="/ai">Zoma.Ai</Link></p>
                    <img src={assets.user_icon} alt="User Icon" />
                </div>
                <div className="main-container">
                    <div className="greet">
                        <p><span>Hello, Dev</span></p>
                        <span>How can I help you?</span>
                    </div>

                    {displayedAnswer && (
                        <div className="answer">
                            <p>Generated Answer:</p>
                            <CopyButton text={displayedAnswer} />
                            <div className="ans">{displayedAnswer}</div>
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); fetchAIContent(); }}>
                        <div className="search-box">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter the prompt"
                            />
                            <img src={assets.send_icon} onClick={fetchAIContent} alt="Send" />
                        </div>
                    </form>

                    <p className="bottom-info">Gemini may display inaccurate info.</p>
                    <p className="bottom-info">Unleash the power of AI</p>
                </div>
            </div>
        </div>
    );
}

export default Ai;
