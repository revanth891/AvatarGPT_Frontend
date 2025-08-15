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
  const [darkMode, setDarkMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Detect mobile keyboard height changes
  useEffect(() => {
    if (window.visualViewport) {
      const handleResize = () => {
        const viewport = window.visualViewport;
        const heightDiff = window.innerHeight - viewport.height;
        setKeyboardOffset(heightDiff > 0 ? heightDiff : 0);
      };
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
      handleResize();
      return () => {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      };
    }
  }, []);

  // Default avatar
  useEffect(() => {
    setSelectedModel("stylized");
  }, [setSelectedModel]);

  const sendMessage = () => {
    if (input.current && input.current.value.trim() !== "") {
      chat(input.current.value);
      input.current.value = "";
    }
  };

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

  const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
    setChatCameraState(state);
    setTranscribeCameraState(state);
  };

  const loading = chatLoading || transcribeLoading;
  const message = chatMessage || transcribeMessage;

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
      className={`group flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold 
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
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-auto">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="gradient-border p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-300"
        >
          {darkMode ? (
            <Sun size={18} className="sm:size-5 text-yellow-300" />
          ) : (
            <Moon size={18} className="sm:size-5 text-blue-500" />
          )}
        </button>
      </div>

      {/* LEFT SIDE BUTTONS */}
      <div className="absolute top-4 sm:top-6 left-2 sm:left-4 flex flex-col gap-2 sm:gap-4 pointer-events-auto">
        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
            <Button
              icon={<ZoomIn size={16} className="sm:size-5" />}
              label="Zoom In"
              onClick={() => setCameraState("zoomed")}
            />
            <Button
              icon={<RotateCcw size={16} className="sm:size-5" />}
              label="Default"
              onClick={() => setCameraState("default")}
            />
            <Button
              icon={<ZoomOut size={16} className="sm:size-5" />}
              label="Zoom Out"
              onClick={() => setCameraState("zoomout")}
            />
          </div>
        </div>

        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
            <Button
              icon={<User size={16} className="sm:size-5" />}
              label="Female"
              onClick={() => setSelectedModel("female")}
            />
            <Button
              icon={<Palette size={16} className="sm:size-5" />}
              label="Stylized"
              onClick={() => setSelectedModel("stylized")}
            />
            <Button
              icon={<Dog size={16} className="sm:size-5" />}
              label="Shiba"
              onClick={() => setSelectedModel("shiba")}
            />
            <Button
              icon={<Camera size={16} className="sm:size-5" />}
              label="Male"
              onClick={() => setSelectedModel("wawa")}
            />
          </div>
        </div>
      </div>

      {/* TOP CENTER MODE SWITCHER */}
      <div className="p-3 sm:p-6 flex justify-center w-full pointer-events-auto">
        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-full">
            <Button
              icon={<MessageSquareText size={14} className="sm:size-4" />}
              label="Text"
              onClick={() => setMode("text")}
            />
            <Button
              icon={<Mic size={14} className="sm:size-4" />}
              label="Voice"
              onClick={() => setMode("voice")}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER INPUT */}
      <div
        className="fixed left-0 w-full flex justify-center px-3 sm:px-0 pointer-events-auto"
        style={{ bottom: `${keyboardOffset > 0 ? keyboardOffset : 16}px` }}
      >
        {mode === "text" ? (
          <div
            className={`gradient-border w-half sm:min-w-[42rem] sm:max-w-[55rem] ${
              darkMode ? "dark-gradient" : ""
            }`}
          >
            <div className="inner flex rounded-full px-4 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
              <input
                ref={input}
                className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-base sm:text-lg ${
                  darkMode
                    ? "text-white placeholder-white"
                    : "text-black placeholder-black"
                }`}
                placeholder="Type your message..."
                onFocus={() => {
                  input.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                icon={<Send size={18} className="sm:size-5" />}
                label="Send"
                onClick={sendMessage}
              />
            </div>
          </div>
        ) : (
          <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
            {/* voice mode UI here */}
          </div>
        )}
      </div>
    </div>
  );
};
