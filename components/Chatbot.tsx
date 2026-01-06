import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, X, Bot, User, MicOff, Globe } from 'lucide-react';
import { Task } from '../types';
import { processCommand } from '../utils/nlp';

interface ChatbotProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const Chatbot: React.FC<ChatbotProps> = ({ tasks, onAddTask, onDeleteTask, onToggleTask, onUpdateTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi! I'm your Todo Assistant. You can speak or type commands like 'Add a task to buy milk' or 'Delete meeting'. I also understand Urdu!", sender: 'bot', timestamp: Date.now() }
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Recognition Setup
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Auto-detect or mixed mode isn't standard, defaulting to English but many engines pick up accents or languages if configured.
    // For specific Urdu support, we might toggle lang, but 'en-US' often works for mixed commands if keywords are simple.
    // Let's toggle language based on user preference if needed, but for simplicity, we use default.
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg: Message = { id: crypto.randomUUID(), text: textToSend, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Process NLP
    setTimeout(() => {
      const result = processCommand(textToSend, tasks);
      
      // Execute Action
      if (result.action === 'ADD' && result.taskPayload) {
        onAddTask(result.taskPayload as Task);
      } else if (result.action === 'DELETE' && result.targetTaskId) {
        onDeleteTask(result.targetTaskId);
      } else if (result.action === 'TOGGLE' && result.targetTaskId) {
        onToggleTask(result.targetTaskId);
      } else if (result.action === 'UPDATE' && result.taskPayload) {
        onUpdateTask(result.taskPayload as Task);
      }

      // Add Bot Response
      const botMsg: Message = { id: crypto.randomUUID(), text: result.response, sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center z-50 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 md:bottom-28 md:right-10 w-[90vw] md:w-[400px] h-[500px] bg-glass-800 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Todo Assistant</h3>
                <p className="text-xs text-indigo-200 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> EN & Urdu Supported
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-end">
                <div className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full animate-pulse border border-indigo-500/30">
                  Listening...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
            <button 
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:text-indigo-400 hover:bg-white/20'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type or speak a command..."
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
