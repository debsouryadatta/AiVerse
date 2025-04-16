"use client";

import React, { useState, useEffect } from "react";
import PlaygroundHeader from "./PlaygroundHeader";
import ModelCard from "./ModelCard";
import PlaygroundInput from "./PlaygroundInput";
import { useChat } from '@ai-sdk/react';
import { LLM_MODEL } from "@/lib/constants";
import { generateId } from "ai";

type ModelCount = 1 | 2 | 3 | 4 | 6;

interface Message {
  role: "user" | "assistant" | "thinking";
  content: string;
  id?: string;
}

const Playground: React.FC = () => {
  const [modelCount, setModelCount] = useState<ModelCount>(3);
  
  // Initial model configurations
  const initialModels = [
    "Gemini 2.5 pro",
    "Gemini 2.0 flash",
    "Deepseek V3",
    "Quasar Alpha",
    "Llama 4 Maverick",
    "Qwen2.5 VL 32B",
  ];
  
  // State to track selected models
  const [selectedModels, setSelectedModels] = useState<string[]>(initialModels);
  
  // State to track messages for each model
  const [modelMessages, setModelMessages] = useState<Message[][]>(
    Array(initialModels.length).fill([]).map(() => [])
  );

  // Create an array of useChat hooks for each model
  const chatHooks = initialModels.map((modelName, index) => {
    return useChat({
      api: "/api/chat",
      id: `model-${index}`,
      body: {
        model: LLM_MODEL[modelName as keyof typeof LLM_MODEL]
      }
    });
  });

  // // Effect to sync the chat messages with our UI state
  // useEffect(() => {
  //   initialModels.forEach((_, index) => {
  //     if (index < modelCount) {
  //       const chatMessages = chatHooks[index].messages;
        
  //       // Only update if we have messages and they're different from what we have
  //       if (chatMessages.length > 0) {
  //         setModelMessages(prevMessages => {
  //           const updatedMessages = [...prevMessages];
            
  //           // Convert AI SDK messages to our format with proper typing
  //           const formattedMessages = chatMessages.map(msg => ({
  //             role: msg.role === "user" ? "user" as const : "assistant" as const,
  //             content: msg.content,
  //             id: msg.id
  //           }));
            
  //           // Only update if the messages are different
  //           if (JSON.stringify(formattedMessages) !== JSON.stringify(updatedMessages[index])) {
  //             updatedMessages[index] = formattedMessages;
  //             return updatedMessages;
  //           }
            
  //           return prevMessages;
  //         });
  //       }
  //     }
  //   });
  // }, [chatHooks, modelCount, initialModels]);
  
  // Function to handle model change
  const handleModelChange = (index: number, newModel: string) => {
    const updatedModels = [...selectedModels];
    updatedModels[index] = newModel;
    setSelectedModels(updatedModels);
    
    // Reset the messages for this model
    setModelMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = [];
      return updatedMessages;
    });
    
    // Reset the chat for this model
    chatHooks[index].reload();
  };

  // Function to handle sending prompts to all models
  const handleSendPrompt = (prompt: string) => {
    const messageId = generateId();
    
    // Add user message to all visible models simultaneously
    for (let i = 0; i < modelCount; i++) {
      // Add thinking message to UI
      setModelMessages(prevMessages => {
        const updatedMessages = [...prevMessages.map(messages => [...messages])];
        updatedMessages[i] = [
          ...updatedMessages[i],
          { role: "user", content: prompt, id: messageId },
          { role: "thinking", content: "Thinking..." } // Add thinking message immediately
        ];
        return updatedMessages;
      });
      
      // Submit the message to each model's chat hook
      chatHooks[i].append({
        role: "user",
        content: prompt,
        id: messageId
      });
    }
  };

  // Effect to remove thinking messages when a response starts coming in
  useEffect(() => {
    for (let i = 0; i < modelCount; i++) {
      if (chatHooks[i].isLoading === false && modelMessages[i]?.some(msg => msg.role === "thinking")) {
        setModelMessages(prevMessages => {
          const updatedMessages = [...prevMessages.map(messages => [...messages])];
          // Remove thinking message
          updatedMessages[i] = updatedMessages[i].filter(msg => msg.role !== "thinking");
          return updatedMessages;
        });
      }
    }
  }, [chatHooks, modelCount, modelMessages]);

  // Determine grid classes based on the number of models
  const getGridClasses = () => {
    switch (modelCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
      case 6:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 md:grid-cols-3";
    }
  };

  // Get the visible models based on the selected count
  const visibleModels = selectedModels.slice(0, modelCount);
  const visibleMessages = modelMessages.slice(0, modelCount);
  const visibleIsLoading = chatHooks.slice(0, modelCount).map(hook => hook.isLoading);

  return (
    <div className="flex flex-col h-full">
      <PlaygroundHeader modelCount={modelCount} setModelCount={setModelCount} />
      
      <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-neutral-950">
        <div className={`grid ${getGridClasses()} gap-4 h-full`}>
          {visibleModels.map((modelName, index) => (
            <div key={index} className="h-[400px]">
              <ModelCard 
                modelName={modelName} 
                isReady={!visibleIsLoading[index]}
                messages={visibleMessages[index]}
                onModelChange={(newModel) => handleModelChange(index, newModel)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
      
      <PlaygroundInput onSendPrompt={handleSendPrompt} />
    </div>
  );
};

export default Playground;
