"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconCopy, IconThumbUp, IconThumbDown, IconAi } from "@tabler/icons-react";

interface Message {
  role: "user" | "assistant" | "thinking";
  content: string;
}

interface ModelCardProps {
  modelName: string;
  isReady?: boolean;
  messages?: Message[];
  onModelChange: (newModel: string) => void;
  index: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ 
  modelName, 
  isReady = true,
  messages = [],
  onModelChange,
  index
}) => {
  // Check if the model is currently thinking
  const isThinking = messages.some(message => message.role === "thinking");
  
  // Reference to the messages container for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      // Smooth scroll to the bottom
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <Card className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0 shrink-0">
        <div className="flex items-center gap-2">
          <Select 
            value={modelName} 
            onValueChange={(value) => onModelChange(value)}
          >
            <SelectTrigger className="w-[180px] h-8 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <IconAi className="h-6 w-6" />
                <span className="truncate">
                  {modelName}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <SelectItem value="Gemini 2.5 pro" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Gemini 2.5 pro</span>
                </div>
              </SelectItem>
              <SelectItem value="Gemini 2.0 flash" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Gemini 2.0 flash</span>
                </div>
              </SelectItem>
              <SelectItem value="Deepseek V3" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Deepseek V3</span>
                </div>
              </SelectItem>
              <SelectItem value="Quasar Alpha" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Quasar Alpha</span>
                </div>
              </SelectItem>
              <SelectItem value="Llama 4 Maverick" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Llama 4 Maverick</span>
                </div>
              </SelectItem>
              <SelectItem value="Qwen2.5 VL 32B" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconAi className="h-6 w-6" />
                  <span>Qwen2.5 VL 32B</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className={`flex items-center gap-1 px-2 py-0.5 h-6 ${isReady ? 'text-green-600 dark:text-green-500 border-green-200 dark:border-green-800' : 'text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          {isReady ? 'Ready' : 'Loading'}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-3 pt-2 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-y-auto custom-scrollbar pr-1">
          {messages.length > 0 ? (
            <div className="flex flex-col gap-4">
              {messages.map((message, i) => {
                // Skip rendering thinking messages directly, we'll show a special UI for that
                if (message.role === 'thinking' && i === messages.length - 1) {
                  return (
                    <div key={i} className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                        <IconAi className="h-6 w-6" />
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 flex items-center">
                        <span>Thinking</span>
                        <span className="ml-1 inline-flex">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                        </span>
                      </div>
                    </div>
                  );
                }
                
                if (message.role === 'thinking') return null;
                
                return (
                  <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'user' ? (
                      <div className="bg-black text-white rounded-lg px-3 py-2 max-w-[80%]">
                        {message.content}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center mt-1">
                            <IconAi className="h-6 w-6" />
                          </div>
                          <div className="bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-neutral-700">
                            {message.content}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-8">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <IconCopy className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <IconThumbUp className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <IconThumbDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Send a message to start the conversation</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
