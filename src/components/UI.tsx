

import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Palette,
  Dog,
  Camera,
  MessageSquareText,
  Mic,
  Send,
  Moon,
  Sun,
} from "lucide-react";

export const UI = ({
  hidden,
  setSelectedModel,
}: {
  hidden?: boolean;
  setSelectedModel: (m: string) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const {
    chat,
    loading: chatLoading,
    setCameraState: setChatCameraState,
    message: chatMessage,
  } = useChat();
  const {
    transcribe,
    loading: transcribeLoading,
    setCameraState: setTranscribeCameraState,
    message: transcribeMessage,
  } = useTranscribe();

  const [mode, setMode] = useState<"text" | "voice">("text");
  const [darkMode, setDarkMode] = useState(true); // Light mode default
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // ✅ Set default avatar to "stylized" on mount
  useEffect(() => {
    setSelectedModel("stylized");
  }, [setSelectedModel]);

  // Send text message
  const sendMessage = () => {
    if (input.current && input.current.value.trim() !== "") {
      chat(input.current.value);
      input.current.value = "";
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        await transcribe(audioFile);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Camera control
  const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
    setChatCameraState(state);
    setTranscribeCameraState(state);
  };

  const loading = chatLoading || transcribeLoading;
  const message = chatMessage || transcribeMessage;

  // Styled button
  const Button = ({
    icon,
    label,
    onClick,
  }: {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold 
                 backdrop-blur-md border shadow-md transition-all duration-300 w-fit
                 ${
                   darkMode
                     ? "text-white border-white/20 bg-white/10 hover:bg-white/20"
                     : "text-black border-black/10 bg-black/5 hover:bg-black/10"
                 }`}
    >
      <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
        {icon}
      </span>
      <span
        className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
                   group-hover:ml-1 transition-all duration-300 whitespace-nowrap"
      >
        {label}
      </span>
    </button>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between transition-all duration-500 ${
        hidden ? "hidden" : ""
      } ${darkMode ? "text-white" : "text-black"}`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="gradient-border p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-300"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-300" />
          ) : (
            <Moon size={20} className="text-blue-500" />
          )}
        </button>
      </div>

      {/* LEFT SIDE BUTTONS */}
      <div className="absolute top-6 left-4 flex flex-col gap-4 pointer-events-auto">
        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner p-3 flex flex-col gap-3">
            <Button
              icon={<ZoomIn size={20} />}
              label="Zoom In"
              onClick={() => setCameraState("zoomed")}
            />
            <Button
              icon={<RotateCcw size={20} />}
              label="Default"
              onClick={() => setCameraState("default")}
            />
            <Button
              icon={<ZoomOut size={20} />}
              label="Zoom Out"
              onClick={() => setCameraState("zoomout")}
            />
          </div>
        </div>

        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner p-3 flex flex-col gap-3">
            <Button
              icon={<User size={20} />}
              label="Female"
              onClick={() => setSelectedModel("female")}
            />
            <Button
              icon={<Palette size={20} />}
              label="Stylized"
              onClick={() => setSelectedModel("stylized")}
            />
            <Button
              icon={<Dog size={20} />}
              label="Shiba"
              onClick={() => setSelectedModel("shiba")}
            />
            <Button
              icon={<Camera size={20} />}
              label="Male"
              onClick={() => setSelectedModel("wawa")}
            />
          </div>
        </div>
      </div>

      {/* TOP CENTER MODE SWITCHER */}
      <div className="p-6 flex justify-center w-full pointer-events-auto">
        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner flex gap-3 p-3 rounded-full">
            <Button
              icon={<MessageSquareText size={18} />}
              label="Text"
              onClick={() => setMode("text")}
            />
            <Button
              icon={<Mic size={18} />}
              label="Voice"
              onClick={() => setMode("voice")}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER INPUT */}
      <div className="mb-[5rem] self-center pointer-events-auto w-full flex justify-center">
        {mode === "text" ? (
          <div
            className={`gradient-border min-w-[42rem] max-w-[55rem] ${
              darkMode ? "dark-gradient" : ""
            }`}
          >
            <div className="inner flex rounded-full px-6 py-3 gap-3">
              <input
                ref={input}
                className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-lg ${
                  darkMode
                    ? "text-white placeholder-white"
                    : "text-black placeholder-black"
                }`}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                icon={<Send size={20} />}
                label="Send"
                onClick={sendMessage}
              />
            </div>
          </div>
        ) : (
          <div
            className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}
          >
            <div className="inner flex flex-col items-center gap-4 text-sm px-6 py-4">
              <Button
                icon={<Mic size={24} />}
                label={isRecording ? "Stop" : "Record"}
                onClick={isRecording ? stopRecording : startRecording}
              />
              <div
                className={`text-center opacity-80 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {isRecording
                  ? "Recording... Tap to stop."
                  : loading
                  ? "Processing..."
                  : "Tap to record your message."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
