"use client";

import { useEffect, useRef, useState } from "react";
import { Message, VoiceMentorModel } from "@/types";
import { toast } from "sonner";
import { updateVoiceMentorDetailsAction } from "@/app/(inner_routes)/aitools/voicementor/actions";
import { reduceCredits } from "@/app/(inner_routes)/aitools/voicementor/[...slug]/actions";
import { useGlobalCreditsStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

type State = {
  sender: string;
  response: string | null | undefined;
};

function VoiceSynthesizer({
  state,
  displaySettings,
  recordingStatus,
  setRecordingStatus,
  voiceMentorDetails,
  isTimerRunning,
  setIsTimerRunning,
  setMessages
}: {
  state: State;
  displaySettings: boolean;
  recordingStatus: string;
  setRecordingStatus: (status: string) => void;
  voiceMentorDetails: VoiceMentorModel;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  setMessages: (messages: Message[]) => void;
}) {
  const [voiceId, setVoiceId] = useState<string>(""); // Default voice ID
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const creditIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { credits, setCredits } = useGlobalCreditsStore();
  
  const session = useSession();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    // Start credit reduction interval
    creditIntervalRef.current = setInterval(async () => {
      const result = await reduceCredits(voiceMentorDetails.userId);
      if (!result.success) {
        toast.error(result.error);
        stopTimer(); // Stop timer if credits can't be reduced
        return;
      }
      setCredits(result.remainingCredits!);
      toast.success(`Credits remaining: ${result.remainingCredits}`);
    }, 10000); // Every 10 seconds
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (creditIntervalRef.current) {
      clearInterval(creditIntervalRef.current);
    }
    setIsTimerRunning(false);
    setTime(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (creditIntervalRef.current) {
        clearInterval(creditIntervalRef.current);
      }
    };
  }, []);

  const getAudio = async (text: string) => {
    const url = `https://api.deepgram.com/v1/speak?model=${voiceId}`;
    const data = JSON.stringify({ text });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: data,
    });

    // Check if the response is OK
    if (!response.ok) {
      console.error("Error fetching audio:", response.statusText);
      return;
    }

    const audioBlob = await response.blob();
    const urlBlob = URL.createObjectURL(audioBlob);
    audioRef.current = new Audio(urlBlob);
    audioRef.current.play();
  };

  const changeVoice = async (voiceId: string) => {
    try {
      await updateVoiceMentorDetailsAction(voiceMentorDetails.id, session?.data?.user?.id!, { voiceId });
      setVoiceId(voiceId);
      toast.success("Voice successfully changed to " + voiceId);
    } catch (error) {
      console.log("Error", error);
      toast.error("Error changing voice");
    }
  };

  const deleteChatHistory = async () => {
    try {
      await updateVoiceMentorDetailsAction(voiceMentorDetails.id, session?.data?.user?.id!, { chatHistory: [] });
      setMessages([]);
      toast.success("Chat history deleted successfully");
    } catch (error) {
      console.log("Error", error);
      toast.error("Error deleting chat history");
    }
  }

  useEffect(() => {
    console.log("Voice ID from Voice Synthesizer:", voiceMentorDetails?.voiceId);
    setVoiceId(voiceMentorDetails?.voiceId);
  }, [voiceMentorDetails?.voiceId]);

  useEffect(() => {
    if (!state.response) return;

    // Call the getAudio function instead of using the SpeechSynthesis API
    getAudio(state.response);
  }, [state]);

  useEffect(() => {
    console.log("Recording Status from Voice Synthesizer:", recordingStatus);
    
    if (recordingStatus === "recording" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [recordingStatus]);


  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit mb-10">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              value={voiceId}
              onChange={(e) => changeVoice(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 w-full"
            >
              <option value="" disabled>Select a voice</option>
              <option value="aura-luna-en">Female US Accent</option>
              <option value="aura-athena-en">Female UK Accent</option>
              <option value="aura-orion-en">Male US Accent</option>
              <option value="aura-helios-en">Male UK Accent</option>
            </select>
          </div>
          <Button onClick={deleteChatHistory} className="-mt-6 bg-zinc-100 text-black h-8">Delete Chats</Button>
        </>
      )}

      <div className="w-full px-4 flex items-center justify-between">
        <button
          onClick={startTimer}
          disabled={isTimerRunning}
          className={`px-4 py-2 rounded-full ${
            isTimerRunning
              ? 'bg-zinc-800 text-zinc-600'
              : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
          } transition-colors`}
        >
          Start
        </button>

        <div className="text-xs text-zinc-400 font-mono">
          {formatTime(time)}
        </div>

        <button
          onClick={stopTimer}
          disabled={!isTimerRunning}
          className={`px-4 py-2 rounded-full ${
            !isTimerRunning
              ? 'bg-zinc-800 text-zinc-600'
              : 'bg-red-600/80 hover:bg-red-600 text-white'
          } transition-colors`}
        >
          End
        </button>
      </div>
    </div>
  );
}

export default VoiceSynthesizer;