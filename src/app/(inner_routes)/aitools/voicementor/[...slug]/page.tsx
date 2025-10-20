"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Recorder from "@/components/aitools/voicementor/Recorder";
import VoiceSynthesizer from "@/components/aitools/voicementor/VoiceSynthesizer";
import Messages from "@/components/aitools/voicementor/Messages";
import { SettingsIcon } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { transcript } from "./actions";
import {
  getVoiceMentorDetailsAction,
  updateVoiceMentorDetailsAction,
} from "../actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import LoadingComponent from "@/app/(inner_routes)/loading";
import { Message, VoiceMentorModel } from "@/types";
import { useRouter } from "next/navigation";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

type Props = {
  params: {
    slug: string;
  };
};

export default function Home({ params: { slug } }: Props) {
  const [state, formAction] = useFormState(transcript, initialState);
  const voiceMentorId = slug[0];
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);
  const [voiceResponseLoading, setVoiceResponseLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [loading, setLoading] = useState(false);
  const [voiceMentorDetails, setVoiceMentorDetails] = useState<VoiceMentorModel | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const router = useRouter();
  const session = useSession();

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    const updateChatHistory = async (updatedChatHistory: Message[]) => {
      try {
        await updateVoiceMentorDetailsAction(
          voiceMentorId,
          session?.data?.user?.id!,
          { chatHistory: updatedChatHistory }
        );
      } catch (error) {
        console.log("Error", error);
        toast.error("Error updating chat history");
        setVoiceResponseLoading(false);
      }
    };
    if (state.response && state.sender) {
      const updatedChatHistory = [
        ...messages,
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
      ];
      updateChatHistory(updatedChatHistory);
      setMessages(updatedChatHistory);
      setVoiceResponseLoading(false);
    }
  }, [state]);

  useEffect(() => {
    const getVoiceMentorDetails = async () => {
      setLoading(true);
      try {
        const voiceMentor = await getVoiceMentorDetailsAction(
          voiceMentorId,
          session?.data?.user?.id!
        );
        console.log("VoiceMentor", voiceMentor);
        setVoiceMentorDetails(voiceMentor);

        if (voiceMentor?.chatHistory) {
          const slicedMessages: Message[] = voiceMentor.chatHistory
            .slice(-20)
            .map((msg: any) => ({
              sender: msg.sender || "",
              response: msg.response || "",
              id: msg.id || "",
            }));
          setMessages(slicedMessages);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    };
    getVoiceMentorDetails();

    return () => {
      cleanupMicPermissions();
    }
  }, []);

  const cleanupMicPermissions = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      })
      .catch(err => console.log(err));
    }
  };

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // Submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setVoiceResponseLoading(true);
    const formData = new FormData();
    if (fileRef.current && fileRef.current.files) {
      formData.append("audio", fileRef.current.files[0]);
    }
    formData.append("messages", JSON.stringify([...messages]));
    formData.append(
      "voiceMentorDescription",
      voiceMentorDetails?.description || ""
    );

    // Checking gagain if the timer is running
    if (!isTimerRunning) {
      toast.error("Start the timer first");
      return;
    }
    formAction(formData);
  };

  if (!session?.data?.user) {
    toast("You need to be logged in to use Voice Mentor.");
    return router.push("/aitools/voicementor");
  }

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="h-screen">
      <BeatLoader
        className="absolute top-1/2 left-1/2 "
        color="#ffffff"
        loading={voiceResponseLoading}
      />
      <div
        onClick={() => setDisplaySettings(!displaySettings)}
        className="absolute top-[100px] right-6 z-50 sm:top-16 cursor-pointer"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors backdrop-blur-md border border-zinc-200 dark:border-white/20">
          <SettingsIcon className="w-4 h-4 text-amber-500 dark:text-yellow-400 group-hover:text-amber-600 dark:group-hover:text-yellow-300 transition-colors" />
          <span className="text-sm font-medium text-zinc-800 dark:text-white/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            voice
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col bg-black">
        <div className="bg-zinc-200 dark:bg-zinc-900">
          <Messages messages={messages} />
        </div>

        <input type="file" name="audio" ref={fileRef} hidden />
        <button type="submit" hidden ref={submitButtonRef} />

        <div className="fixed bottom-0 w-[100%] md:w-[95%] overflow-hidden bg-black rounded-t-3xl">
          <Recorder
            uploadAudio={uploadAudio}
            recordingStatus={recordingStatus}
            setRecordingStatus={setRecordingStatus}
            isTimerRunning={isTimerRunning}
          />
          <div className="">
            <VoiceSynthesizer
              state={state}
              displaySettings={displaySettings}
              recordingStatus={recordingStatus}
              setRecordingStatus={setRecordingStatus}
              voiceMentorDetails={voiceMentorDetails!}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              setMessages={setMessages}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
