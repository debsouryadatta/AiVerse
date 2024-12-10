import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is AiVerse?",
    answer: "AiVerse is an AI-powered learning platform that combines course generation, personalized learning tools, and community features. It helps make learning smarter and more engaging through AI technology.",
    value: "item-1",
  },
  {
    question: "How does the credits system work?",
    answer: "Credits are used to access premium features like AI course generation, voice mentors, and roadmap creation. You can purchase credits through our different pricing plans: Starter (2000 credits), Standard (5000 credits), or Premium (10000 credits).",
    value: "item-2",
  },
  {
    question: "What can I do with AI-generated courses?",
    answer: "You can create comprehensive courses with AI-generated content, MCQs for concept checking, integrate YouTube videos, add Unsplash images, control course visibility with invite codes, and even export courses as PDFs.",
    value: "item-3",
  },
  {
    question: "What are Voice Mentors?",
    answer: "Voice Mentors are personalized AI assistants that you can talk to for interactive learning. You can customize their behavior and use them to enhance your learning experience through natural conversation.",
    value: "item-4",
  },
  {
    question: "What new features are coming to AiVerse?",
    answer: "We're working on exciting features including the ability to chat with website content, interact with PDFs, and new AI agents to enhance your learning experience even further.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32 relative overflow-hidden">
      {/* Circular glow in the background */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[100px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      {/* Diagonal glowing lines */}
      <div className="absolute w-[2px] h-[70%] bg-gradient-to-b from-violet-500/0 via-violet-500/50 to-violet-500/0 blur-[2px] -rotate-45 top-0 left-[20%]" />
      <div className="absolute w-[2px] h-[70%] bg-gradient-to-b from-violet-500/0 via-violet-500/30 to-violet-500/0 blur-[2px] -rotate-45 bottom-0 right-[20%]" />
      
      {/* Content wrapper with glass effect */}
      <div className="relative z-10 backdrop-blur-[2px]">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
            FAQS
          </h2>

          <h2 className="text-3xl md:text-4xl text-center font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>

              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
