"use client";

import { useState, useEffect, useRef } from "react";
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat } from "ai/react";
import ChatBubble from "./ChatBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { Message } from "../../types/message";

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
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: "../api/chat",
  });

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [speech,setSpeech]=useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Speech recognition hook
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Function to toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, history]);

  // Handle clicking on predefined questions
  const handlePredefinedQuestionClick = async (question: string) => {
    setInput(question);
    setPredefinedQuestions([]); // Remove predefined questions after selection
    setIsInputDisabled(false); // Enable input after question is clicked
    await new Promise((resolve) => setTimeout(resolve, 0));
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  // Handle speech recognition start and process transcript
  const handleSpeechToText = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsInputDisabled(true);
    setSpeech(false)
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsInputDisabled(false);
    
    // Set the transcript as input
    setInput(transcript);
   // Sppech msg finished
  setSpeech(true)
  };

  // Reset transcript when input is cleared
  useEffect(() => {
    if (!input) {
      resetTranscript();
    }
  }, [input, resetTranscript]);

  // Hide predefined questions when typing or using speech recognition
  useEffect(() => {
    if (input || transcript) {
      setPredefinedQuestions([]);
    }
  }, [input, transcript]);

  return (
    <div>
      {/* Toggle Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-10 bg-gray-300 text-white p-4 z-50 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-115 flex items-center justify-center"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? <IoMdClose size={30} color="black" /> : <IoMdChatbubbles size={30} color="black" />}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="fixed bottom-[90px] z-50 right-4 xs:right-32 lg:right-8 max-sm:w-80 max-sm:max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-80px)] lg:max-h-[calc(100vh-120px)] h-96 border border-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="p-3 bg-blue-500 text-white">
            <h6>Welcome,</h6>
            <h4 className="text-lg font-bold">Hi, I&apos;m Your AI Partner</h4>
          </div>

          {/* Chat message area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-white"
          >
            {[...history, ...messages].map((m, index) => (
              <ChatBubble key={`message-${index}`} role={m.role === "user" ? "User" : "Behrupiya"} content={m.content} />
            ))}
            {/* Predefined questions */}
            { history.length === 1 && predefinedQuestions.length > 0 && (
              <div className="space-y-2">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={`question-${index}`}
                    onClick={() => handlePredefinedQuestionClick(question)}
                    className="block w-full text-left text-lg text-gray-500 font-medium font-sarif bg-red-100 hover:bg-red-200 p-2 rounded-lg"
                    style={{ fontSize: "12px" }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat input area */}
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="p-2 flex items-center bg-white"
          >
            <div className="flex w-full shadow-sm">
              {/* Speech to text button */}
              {!listening && (<button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-600 flex items-center justify-center cursor-pointer"
                onClick={handleSpeechToText}
                aria-label="Start speech recognition"
              >
               <IoMdMic size={25} />
              </button>
 )}
              {/* Stop listening button */}
              {listening && (
            <button
            type="button"
            className="p-2 text-red-500 hover:text-red-600 flex items-center justify-center cursor-pointer animate-zoom-in-out"
            onClick={handleStopListening}
            aria-label="Stop speech recognition"
          >
            <IoMdMicOff size={25} />
          </button>
          
              )}

              {/* Text input field */}
              <input
                className={`flex-1 p-2 border-none rounded-lg w-full bg-gray-300 focus:outline-none `}
                value={transcript || input}
                placeholder="Say something or type..."
                onChange={handleInputChange}
                disabled={isInputDisabled}
                aria-label="Chat input"
              />

              {/* Send button */}
              <button
                type="submit"
                className={`p-2 flex items-center justify-center ${
                  input || speech ? "text-blue-500" : "text-gray-500 hover:text-gray-600 cursor-pointer"
                }`}
                disabled={isInputDisabled}
                aria-label="Send message"
              >
                <IoSendSharp size={30} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;


