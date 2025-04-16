"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconSend, IconPaperclip } from "@tabler/icons-react";

interface PlaygroundInputProps {
  onSendPrompt: (prompt: string) => void;
}

const PlaygroundInput: React.FC<PlaygroundInputProps> = ({ onSendPrompt }) => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendPrompt = () => {
    if (prompt.trim() === "" || isSubmitting) return;
    
    setIsSubmitting(true);
    onSendPrompt(prompt);
    setPrompt("");
    
    // Reset submitting state after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            placeholder="How can I help you today?"
            className="min-h-[50px] max-h-[200px] pr-10 resize-none border-gray-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-gray-400 dark:focus-visible:ring-neutral-600"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Attach file"
          >
            <IconPaperclip className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-black text-white hover:bg-gray-800"
          onClick={handleSendPrompt}
          disabled={prompt.trim() === "" || isSubmitting}
        >
          <IconSend className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundInput;
