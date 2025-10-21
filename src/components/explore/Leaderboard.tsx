'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Flame } from 'lucide-react';
import { getLeaderboard } from '@/app/(inner_routes)/explore/actions';
import Image from 'next/image';

interface LeaderboardEntry {
  rank: number;
  name: string;
  image: string | null;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface Game {
  id: string;
  name: string;
  icon: any;
}

const GAMES: Game[] = [
  {
    id: 'quick-solo',
    name: 'Quick Solo Quiz',
    icon: Trophy
  }
];

export default function Leaderboard() {
  const [activeGame, setActiveGame] = useState('quick-solo');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(activeGame);
  }, [activeGame]);

  const fetchLeaderboard = async (quizType: string) => {
    setLoading(true);
    try {
      const result = await getLeaderboard(quizType, 50);
      if (result.success) {
        setLeaderboard(result.leaderboard || []);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-400/10 border-gray-200 dark:border-gray-400/20';
    if (rank === 3) return 'bg-orange-50 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20';
    return 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700';
  };

  const getRankTextColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 dark:text-yellow-400';
    if (rank === 2) return 'text-gray-600 dark:text-gray-300';
    if (rank === 3) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-zinc-400';
  };

  return (
    <div className="mt-10 min-h-[75vh] w-[90vw] max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
        </div>
        <p className="text-gray-600 dark:text-zinc-400">
          Compete with players worldwide and earn your place at the top!
        </p>
      </div>

      <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mb-6">
          {GAMES.map((game) => (
            <TabsTrigger key={game.id} value={game.id} className="flex items-center gap-2 text-gray-700 dark:text-white">
              <Flame className="h-4 w-4" />
              {game.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {GAMES.map((game) => (
          <TabsContent key={game.id} value={game.id}>
            <Card className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{game.name} Leaderboard</CardTitle>
                <CardDescription className="text-gray-600 dark:text-zinc-400">
                  Top players ranked by score
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-600 dark:text-zinc-400">Loading leaderboard...</p>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-600 dark:text-zinc-400">No scores yet. Be the first to play!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry) => (
                      <div
                        key={`${entry.rank}-${entry.name}`}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${getRankColor(entry.rank)} transition-all hover:shadow-lg`}
                      >
                        {/* Rank */}
                        <div className="flex items-center justify-center min-w-fit">
                          {getMedalIcon(entry.rank) ? (
                            <div className="flex items-center justify-center w-10 h-10">
                              {getMedalIcon(entry.rank)}
                            </div>
                          ) : (
                            <div className={`w-10 h-10 flex items-center justify-center rounded font-bold ${getRankTextColor(entry.rank)}`}>
                              {entry.rank}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {entry.image ? (
                            <Image
                              src={entry.image}
                              alt={entry.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{entry.name}</p>
                            <p className="text-xs text-gray-600 dark:text-zinc-400">
                              {entry.correctAnswers}/{entry.totalQuestions} correct
                            </p>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right min-w-fit">
                          <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{entry.score}%</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}