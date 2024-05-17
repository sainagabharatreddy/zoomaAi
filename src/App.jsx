import axios from 'axios';
import './App.css'; // Import your CSS file
import { assets } from "./assets/assets";
import { useState, useEffect } from 'react';

function App() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [extended, setExtended] = useState(false);
    const [displayedAnswer, setDisplayedAnswer] = useState("");
    const [ setHistory] = useState([]);
    const [recentChats, setRecentChats] = useState([]);

    async function fetchAIContent() {
        setAnswer("Loading...");
        setDisplayedAnswer("Loading...");
        try {
            const response = await axios({
                method: 'post',
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyC1wNs_9kk_vomJ4kTaAOZWP9o18QwCogg',
                data: {
                    contents: [{
                        parts: [{ text: question }]
                    }],
                },
            });
            const generatedAnswer = response.data.candidates[0].content.parts[0].text;
            setAnswer(generatedAnswer);
            setDisplayedAnswer(generatedAnswer);
            addToHistory(question, generatedAnswer);
            addToRecentChats(question);
        } catch (error) {
            setAnswer("Error fetching data");
            setDisplayedAnswer("Error fetching data");
        }
    }

    useEffect(() => {
        let currentIndex = 0;
        let interval;
        if (answer && answer !== "Loading...") {
            setDisplayedAnswer("");
            interval = setInterval(() => {
                setDisplayedAnswer(prev => prev + answer[currentIndex]);
                currentIndex++;
                if (currentIndex === answer.length) {
                    clearInterval(interval);
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [answer]);

    const handleNewChat = () => {
        setQuestion("");
        setAnswer("");
        setDisplayedAnswer("");
    };

    const addToHistory = (question, answer) => {
        const newHistoryItem = { question, answer };
        setHistory(prev => [...prev, newHistoryItem]);
    };

    const addToRecentChats = (question) => {
        setRecentChats(prev => [question, ...prev]);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <div className="top">
                    <img onClick={() => setExtended(prev => !prev)} src={assets.menu_icon} className="menu" alt="Menu Icon" />
                    <div className="new-chat" onClick={handleNewChat}>
                        <img src={assets.plus_icon} alt="Plus Icon" />
                        {extended ? <p>New Chat</p> : null}
                    </div>
                    {extended ?
                        <div className="recent">
                            <h2>Recent Chats</h2>
                            <ul>
                                {recentChats.map((chat, index) => (
                                    <li key={index}>{chat}</li>
                                ))}
                            </ul>
                        </div>
                        : null
                    }
                </div>
                <div className="bottom">
                    <div className="bottom-item recent-entry">
                        <img src={assets.question_icon} alt="Question Icon" />
                        {extended ? <p>Help</p> : null}
                    </div>
                    <div className="bottom-item recent-entry">
                        <img src={assets.history_icon} alt="History Icon" />
                        {extended ? <p>History</p> : null}
                    </div>
                    <div className="bottom-item recent-entry">
                        <img src={assets.setting_icon} alt="Setting Icon" />
                        {extended ? <p>Setting</p> : null}
                    </div>
                </div>
            </div>

            <div className="main">
                <div className="nav">
                    <p>Zoma.Ai</p>
                    <img src={assets.user_icon} alt="User Icon" />
                </div>
                <div className="main-container">
                    <div className="greet">
                        <p>
                            <span>Hello, Dev</span>
                        </p>
                        <p>How can I help you?</p>
                    </div>
                    
                    <div className="main-bottom">
                        <div className="search-box">
                            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter the prompt" />
                            <img src={assets.send_icon} onClick={fetchAIContent} alt="Send Icon" />
                        </div>
                        <p className="bottom-info">
                            Gemini may display inaccurate info.
                        </p>
                    </div>
                </div>
            </div>
            <div className="answer">
                <p>Prompt:</p>
                <div className="ans">Question: {question}</div>
                
                <div className="ans">Answer: {displayedAnswer}</div>
            </div>

            
        </div>
    );
}

export default App;
