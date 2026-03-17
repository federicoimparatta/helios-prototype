"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const sampleMessages: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "What's the current status of Chiller-2?",
    timestamp: "4:32 PM",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      'Chiller-2 is showing elevated vibration levels (warning status). Current load is at 85% capacity with CHW supply temp of 46.5\u00B0F. I recommend reviewing SOP-001 for switchover procedure if maintenance is needed.',
    timestamp: "4:32 PM",
  },
  {
    id: "m3",
    role: "user",
    content: "What are today's optimization savings?",
    timestamp: "4:33 PM",
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "Today's day-ahead optimization plan projects $12,400 in savings through chiller sequencing adjustments and BESS arbitrage. Peak demand is expected to be reduced by 15% during the 12:00-16:00 window.",
    timestamp: "4:33 PM",
  },
];

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content:
          "I'm analyzing your request against the current site telemetry and operational data. Based on the knowledge graph and active SOPs, I can provide a detailed assessment. Is there a specific asset or metric you'd like me to focus on?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="chat-panel-enter relative w-[420px] max-w-full h-full bg-white shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-navy to-navy-light border-b border-navy-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                Helios AI Assistant
              </h2>
              <p className="text-blue-light text-xs">
                Operational intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          {/* Welcome message */}
          <div className="flex justify-center mb-2">
            <div className="bg-navy/5 text-navy/60 text-xs px-3 py-1.5 rounded-full">
              Today
            </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-navy text-white"
                    : "bg-gradient-to-br from-teal to-teal-dark text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-navy text-white rounded-tr-md"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-white/50" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              "Show site alerts",
              "BESS status",
              "Today's schedule",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full border border-teal/30 text-teal-dark hover:bg-teal/5 whitespace-nowrap transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about operations, assets, SOPs..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-teal text-white flex items-center justify-center hover:bg-teal-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Helios AI may produce inaccurate information. Verify critical
            operational decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
