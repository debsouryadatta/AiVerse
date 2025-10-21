import CourseQuizGame from "@/components/game/CourseQuizGame";
import { notFound } from "next/navigation";

interface GamePageProps {
  params: {
    gameType: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const { gameType } = params;

  // Render different game components based on gameType
  if (gameType === 'course-quiz') {
    return (
      <div className="container mx-auto py-8 px-4">
        <CourseQuizGame />
      </div>
    );
  }

  if (gameType === 'quick-trivia') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Quick Trivia</h1>
          <p className="text-muted-foreground">Coming Soon!</p>
        </div>
      </div>
    );
  }

  // Game not found
  notFound();
}

export const dynamic = 'force-dynamic';
