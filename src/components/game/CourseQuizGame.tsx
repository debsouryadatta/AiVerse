'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Coins, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateCourseQuizAction, getUserCourses, saveGameScore } from '@/app/(inner_routes)/game/[gameType]/actions';
import type { Question } from '@/types/games';
import { toast } from 'sonner';
import { useGlobalCreditsStore } from '@/store/credit';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

type GameState = 'select' | 'playing' | 'results';

export default function CourseQuizGame() {
  const router = useRouter();
  const { credits, setCredits } = useGlobalCreditsStore();
  const [gameState, setGameState] = useState<GameState>('select');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate credits required based on difficulty
  const getCreditsRequired = (diff: string) => {
    return diff === 'easy' ? 10 : diff === 'medium' ? 20 : 30;
  };

  const creditsRequired = getCreditsRequired(difficulty);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const result = await getUserCourses();
    if (result.success) {
      setCourses(result.courses || []);
    }
  };

  const startQuiz = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    if (credits !== null && credits < creditsRequired) {
      toast.error(`Not enough credits. Required: ${creditsRequired}, Available: ${credits}`);
      return;
    }

    setLoading(true);
    const result = await generateCourseQuizAction(selectedCourse, difficulty);
    setLoading(false);

    if (result.success && result.questions) {
      // Update credits in store
      if (credits !== null && result.creditsUsed) {
        setCredits(credits - result.creditsUsed);
        toast.success(`Quiz generated! ${result.creditsUsed} credits used`);
      }

      setQuestions(result.questions);
      setGameState('playing');
      setStartTime(Date.now());
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
    } else {
      toast.error(result.error || 'Failed to generate quiz');
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: boolean[]) => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    setTimeSpent(totalTime);

    const correctCount = finalAnswers.filter(a => a).length;
    const score = Math.round((correctCount / questions.length) * 100);

    try {
      const result = await saveGameScore({
        quizType: 'quick-solo',
        courseId: selectedCourse,
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeSpent: totalTime,
        difficulty
      });

      if (result.success) {
        toast.success('Quiz score saved successfully!');
        setGameState('results');
      } else {
        toast.error(result.error || 'Failed to save quiz score');
        console.error('Save score error:', result.error);
      }
    } catch (error) {
      console.error('Quiz finish error:', error);
      toast.error('Error saving your quiz score. Please try again.');
    }
  };

  const resetQuiz = () => {
    setGameState('select');
    setSelectedCourse('');
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setTimeSpent(0);
  };

  if (gameState === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Course Quiz Challenge</CardTitle>
            <CardDescription className="text-gray-600 dark:text-zinc-400">
              Test your knowledge with AI-generated questions from your courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Select Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Difficulty</label>
                <span className="text-xs text-gray-600 dark:text-zinc-400">{creditsRequired} credits required</span>
              </div>
              <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (5 questions) - 10 credits</SelectItem>
                  <SelectItem value="medium">Medium (10 questions) - 20 credits</SelectItem>
                  <SelectItem value="hard">Hard (15 questions) - 30 credits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={startQuiz}
              className="w-full"
              disabled={loading || !selectedCourse}
            >
              {loading ? 'Generating Quiz...' : 'Start Quiz'}
            </Button>

            {courses.length === 0 && (
              <div className="space-y-4">
                <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">No Courses Found!</span> You need to create at least one course to participate in the quiz. 
                    <Link href="/create" className="ml-1 underline hover:no-underline font-semibold">
                      Create a course now →
                    </Link>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'playing' && questions.length > 0) {
    const question = questions[currentQuestion];
    const progress = (currentQuestion / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{difficulty.toUpperCase()}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white break-words whitespace-normal">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                className={`w-full justify-start text-left h-auto py-3 px-4 ${
                  selectedAnswer === index
                    ? 'bg-blue-600 text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700'
                }`}
                onClick={() => setSelectedAnswer(index)}
              >
                <span className="font-semibold mr-3 flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
                <span className="break-words whitespace-normal">{option}</span>
              </Button>
            ))}

            <Button
              onClick={handleAnswer}
              className="w-full mt-4"
              disabled={selectedAnswer === null}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'results') {
    const correctCount = answers.filter(a => a).length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 dark:bg-yellow-400/10 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-3xl text-gray-900 dark:text-white">Quiz Complete!</CardTitle>
            <CardDescription className="text-gray-600 dark:text-zinc-400">Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{score}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Score</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{correctCount}/{questions.length}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Correct</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Time</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                <span>Accuracy</span>
                <span className="font-semibold text-yellow-500 dark:text-yellow-400">{score}%</span>
              </div>
              <Progress value={score} />
            </div>

            <div className="flex gap-2">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => router.push('/explore?tab=games')} className="flex-1">
                Back to Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
