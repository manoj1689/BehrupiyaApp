"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import ChatBubble from "./ChatBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "../../types/message";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const initialPredefinedQuestions = [
  "How do I create an account on Behrupiya?",
  "Can you explain how the AI feature works?",
  "What are the subscription plans available for users?",
];

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([
    {
      role: "Behrupiya",
      content: "Hello! How can I help you?",
    },
  ]);
  const [predefinedQuestions, setPredefinedQuestions] = useState(
    initialPredefinedQuestions
  );
  const { messages, input, setInput, handleInputChange, handleSubmit } =
    useChat({
      api: "../api/chat",
    });

  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, history]);

  const handlePredefinedQuestionClick = async (question: string) => {
    setInput(question);
    setPredefinedQuestions([]);
    setIsInputDisabled(false);
    await new Promise((resolve) => setTimeout(resolve, 0));
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const handleSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setInput(speechResult);
        setIsInputDisabled(false);
        new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
          formRef.current?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        alert("An error occurred with speech recognition. Please try again.");
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };
    } else {
      alert("Sorry, your browser does not support speech recognition!");
    }
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-10 bg-gray-300 text-white p-4 z-50 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-115 flex items-center justify-center"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? <IoMdClose size={30} color="black" /> : <IoMdChatbubbles size={30} color="black" />}
      </button>

      {isChatOpen && (
        <div className="fixed  bottom-[90px] xs:bottom-[10px] lg:bottom-[90px] z-50 right-4 xs:right-32 lg:right-8 max-sm:w-80  max-sm:max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-80px)]  lg:max-h-[calc(100vh-120px)] h-96 border border-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-gray-800 text-white ">
            <h4 className="text-lg font-bold">Your AI Chat Partner</h4>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-white"
          >
            {[...history, ...messages].map((m, index) => (
              <ChatBubble
                key={`message-${index}`}
                role={m.role === "user" ? "User" : "SmartGrader"}
                content={m.content}
              />
            ))}
            {history.length === 1 && predefinedQuestions.length > 0 && (
              <div className="space-y-2">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={`question-${index}`}
                    onClick={() => handlePredefinedQuestionClick(question)}
                    className="block w-full text-left bg-gray-100 hover:bg-gray-200 p-1.5 rounded"
                    style={{ fontSize: "12px" }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="p-2 flex items-center bg-gray-600"
          >
            <div className="flex w-full shadow-sm">
              <button
                type="button"
                className="p-2  text-white flex items-center justify-center"
                onClick={handleSpeechToText}
                disabled={isInputDisabled}
                aria-label="Start speech recognition"
              >
                <MicIcon />
              </button>
              <input
                className={`flex-1 p-2 border-none rounded-lg w-full focus:outline-none ${
                  isInputDisabled ? "cursor-not-allowed" : ""
                }`}
                value={input}
                placeholder="Say something..."
                onChange={handleInputChange}
                disabled={isInputDisabled}
                aria-label="Chat input"
              />
              <button
                type="submit"
                className={`p-2  flex items-center justify-center ${
                  input ? "text-blue-500" : "text-white"
                }`}
                disabled={isInputDisabled}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
