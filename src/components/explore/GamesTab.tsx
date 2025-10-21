'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Leaderboard from "./Leaderboard";
import { QuizGame } from "@/types/games";

const QUIZ_GAMES: QuizGame[] = [
  {
    id: 'quick-solo',
    name: 'Quick Solo Quiz',
    description: 'Test your knowledge with AI-generated questions from your courses',
    icon: GraduationCap,
    creditCost: '10-30',
    estimatedTime: 5,
    href: '/game/course-quiz',
    requiresCourse: true,
    status: 'active'
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer Quiz',
    description: 'Challenge your friends in real-time collaborative quizzes',
    icon: Users,
    creditCost: '15-40',
    estimatedTime: 10,
    href: '/game/multiplayer-quiz',
    requiresCourse: true,
    status: 'coming-soon'
  }
];

export default function GamesTab() {
  return (
    <div className="mt-10 min-h-[75vh] w-[90vw] max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Learning Games</h2>
        <p className="text-gray-600 dark:text-muted-foreground mb-4">
          Challenge yourself and learn while having fun!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {QUIZ_GAMES.map((game) => {
          const Icon = game.icon;
          const isComingSoon = game.status === 'coming-soon';
          
          return (
            <Card 
              key={game.id} 
              className={`bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 transition-all ${
                !isComingSoon 
                  ? 'hover:border-blue-300 dark:hover:border-zinc-700 hover:shadow-lg' 
                  : 'opacity-60'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${
                      isComingSoon 
                        ? 'bg-gray-100 dark:bg-zinc-800/50' 
                        : 'bg-blue-100 dark:bg-zinc-800/50'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isComingSoon 
                          ? 'text-gray-600 dark:text-gray-400' 
                          : 'text-blue-600 dark:text-white'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {game.name}
                        </CardTitle>
                        {isComingSoon && (
                          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          🕐 {game.estimatedTime} min
                        </span>
                        <span className="font-semibold text-amber-600 dark:text-yellow-400">
                          {game.creditCost} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 dark:text-zinc-400">
                  {game.description}
                </CardDescription>
                
                {isComingSoon ? (
                  <Button className="w-full" disabled variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    Coming Soon
                  </Button>
                ) : (
                  <Link href={game.href} className="block">
                    <Button className="w-full">
                      Play Now
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard Section */}
      <Leaderboard />
    </div>
  );
}