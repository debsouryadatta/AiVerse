"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react";


/*
Answers Marked
{
    1: "lorem",
    2: "ipsum",
    3: "dolor",
}

Question State
{
    1: true,
    2: false,
    3: true,
}
*/

export default function McqCards({mcqs}: {mcqs: any}) {

    const [answersMarked, setAnswersMarked] = useState<{ [key: number]: string }>({});
    const [questionState, setQuestionState] = useState<{ [key: number]: boolean }>({});
    console.log("MCQs: ", mcqs);
    
    const checkAnswer = () => {
        const newQuestionState = { ...questionState };
        mcqs.forEach((mcq: {questionId: number, question: string, options: string[], answer: string}) => {
          const user_answer = answersMarked[mcq.questionId];
          if (!user_answer) return;
          if (user_answer === mcq.answer) {
            newQuestionState[mcq.questionId] = true;
          } else {
            newQuestionState[mcq.questionId] = false;
          }
          setQuestionState(newQuestionState);
        });
    }

  return (
    <div className="flex-[1]">
      <div className="">
        {mcqs.map((mcq: {questionId: number, question: string, options: string[], answer: string}, index: number) => {
          return (
            <div
              key={index}
              className={cn("p-3 mt-4 border border-secondary rounded-lg", {
                "bg-green-700": questionState[mcq.questionId] === true,
                "bg-red-700": questionState[mcq.questionId] === false,
                "bg-secondary": questionState[mcq.questionId] === null,
              })}
            >
              <h1 className="text-lg font-semibold">{mcq.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {                    
                    setAnswersMarked({
                      ...answersMarked,
                      [mcq.questionId]: e,
                    });
                  }}
                >
                  {mcq.options.map((option: string, index: number) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem value={option} />
                        <Label htmlFor={`option-${index+1}`}>{option}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>


      <Button className="w-full mt-2" size="lg" onClick={checkAnswer}>
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
