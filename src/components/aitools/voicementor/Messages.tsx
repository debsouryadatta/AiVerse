import { ChevronDownCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SubmitButton from "@/components/aitools/voicementor/SubmitButton";
import { useEffect, useRef } from "react";

type Message = {
  sender: string;
  response: string;
  id: string;
};

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={`flex flex-col min-h-screen p-4 pt-24 ${messages.length > 0 ? "pb-96" : "pb-32"
        }`}
    >
      <div className="flex flex-col flex-1 space-y-6 max-w-4xl mx-auto w-full">
        <SubmitButton />

        {!messages.length && (
          <div className="flex flex-col space-y-8 flex-1 items-center justify-end">
            <p className="text-gray-400 text-lg font-light">Start a conversation...</p>
            <ChevronDownCircle
              size={48}
              className="animate-bounce text-gray-400 opacity-75"
            />
          </div>
        )}

        <div className="space-y-8 -mb-56">
          {messages.map((message) => (
            <div
              key={message.id}
              className="space-y-6 animate-fadeIn"
            >
              {/* sender */}
              <div className="flex items-start justify-end space-x-3">
                <div className="flex-1 max-w-[80%]">
                  <p className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg ml-auto">
                    {message.sender}
                  </p>
                </div>
                <Avatar className="w-10 h-10 border-2 border-gray-700 shadow-md">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>

              {/* receiver */}
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 border-2 border-gray-700 shadow-md">
                  <AvatarImage src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 max-w-[80%]">
                  <p className="bg-gray-800/90 text-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
                    {message.response}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default Messages;