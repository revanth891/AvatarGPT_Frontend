
// import { useRef, useState } from "react";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   User,
//   Palette,
//   Dog,
//   Camera
// } from "lucide-react";

// export const UI = ({
//   hidden,
//   setSelectedModel,
// }: {
//   hidden?: boolean;
//   setSelectedModel: (m: string) => void;
// }) => {
//   const input = useRef<HTMLInputElement>(null);
//   const { chat, loading: chatLoading, setCameraState: setChatCameraState, message: chatMessage } = useChat();
//   const { transcribe, loading: transcribeLoading, setCameraState: setTranscribeCameraState, message: transcribeMessage } = useTranscribe();
  
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<BlobPart[]>([]);
//   const [mode, setMode] = useState<"text" | "voice">("text");

//   const sendMessage = () => {
//     if (input.current && input.current.value.trim() !== "") {
//       chat(input.current.value);
//       input.current.value = "";
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
//         await transcribe(audioFile);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Microphone access denied or unavailable.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
//     setChatCameraState(state);
//     setTranscribeCameraState(state);
//   };

//   const loading = chatLoading || transcribeLoading;
//   const message = chatMessage || transcribeMessage;

//   const Button = ({ icon, label, onClick }: { icon: JSX.Element; label: string; onClick: () => void }) => (
//     <button
//       onClick={onClick}
//       className="group flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-semibold 
//                  backdrop-blur-md border border-white/10 shadow-md bg-white/10 
//                  hover:bg-black/50 transition-all duration-300 w-fit"
//     >
//       <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
//         {icon}
//       </span>
//       <span className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
//                        group-hover:ml-1 transition-all duration-300 whitespace-nowrap">
//         {label}
//       </span>
//     </button>
//   );

//   return (
//     <div className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between ${hidden ? "hidden" : ""}`}>
      
//       {/* LEFT SIDE BUTTONS */}
//       <div className="absolute top-6 left-4 flex flex-col gap-4 pointer-events-auto">
//         {/* Camera Buttons */}
//         <Button icon={<ZoomIn size={20} />} label="Zoom In" onClick={() => setCameraState("zoomed")} />
//         <Button icon={<RotateCcw size={20} />} label="Default" onClick={() => setCameraState("default")} />
//         <Button icon={<ZoomOut size={20} />} label="Zoom Out" onClick={() => setCameraState("zoomout")} />

//         {/* Divider */}
//         <div className="h-px w-10 bg-white/20 mx-auto my-2" />

//         {/* Avatar Switcher */}
//         <Button icon={<User size={20} />} label="Female" onClick={() => setSelectedModel("female")} />
//         <Button icon={<Palette size={20} />} label="Stylized" onClick={() => setSelectedModel("stylized")} />
//         <Button icon={<Dog size={20} />} label="Shiba" onClick={() => setSelectedModel("shiba")} />
//         <Button icon={<Camera size={20} />} label="Male" onClick={() => setSelectedModel("wawa")} />
//       </div>

//       {/* TOP CENTER MODE SWITCHER */}
//       <div className="p-6 flex justify-center w-full pointer-events-auto">
//         <div className="flex gap-3 backdrop-blur-md bg-[#ff00ff0a] border border-white/10 px-4 py-2 rounded-full shadow-md">
//           <button
//             className={`transition-all rounded-full px-4 py-2 text-white text-l font-bold ${
//               mode === "text" ? "bg-white/20" : "hover:bg-white/30"
//             }`}
//             onClick={() => setMode("text")}
//           >
//             💬 Text
//           </button>
//           <button
//             className={`transition-all rounded-full px-4 py-2 text-white text-l font-bold ${
//               mode === "voice" ? "bg-white/20" : "hover:bg-white/10"
//             }`}
//             onClick={() => setMode("voice")}
//           >
//             🎙 Voice
//           </button>
//         </div>
//       </div>

//       {/* BOTTOM CENTER INPUT */}
//       <div className="mb-[5rem] self-center pointer-events-auto w-full flex justify-center">
//         {mode === "text" ? (
//           <div className="flex min-w-[20rem] max-w-[40rem] rounded-full bg-[#1F1F1F0a]/80 border border-white/10 shadow-lg backdrop-blur-md px-6 py-3">
//             <input
//               ref={input}
//               className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400"
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//             />
//             <button
//               onClick={sendMessage}
//               className="ml-4 bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full transition-transform hover:scale-110 text-white"
//             >
//               🚀
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-4 text-white text-sm">
//             <button
//               className={`p-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-700 shadow-xl transition-transform ${
//                 isRecording ? "animate-pulse scale-105" : "hover:scale-110"
//               }`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 isRecording ? stopRecording() : startRecording();
//               }}
//             >
//               🎤
//             </button>
//             <div className="text-center text-white/80">
//               {isRecording
//                 ? "Recording... Tap to stop."
//                 : loading
//                 ? "Processing..."
//                 : "Tap to record your message."}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };















// import { useRef, useState } from "react";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   User,
//   Palette,
//   Dog,
//   Camera,
//   MessageSquareText,
//   Mic,
//   Send
// } from "lucide-react";

// export const UI = ({
//   hidden,
//   setSelectedModel,
// }: {
//   hidden?: boolean;
//   setSelectedModel: (m: string) => void;
// }) => {
//   const input = useRef<HTMLInputElement>(null);
//   const { chat, loading: chatLoading, setCameraState: setChatCameraState, message: chatMessage } = useChat();
//   const { transcribe, loading: transcribeLoading, setCameraState: setTranscribeCameraState, message: transcribeMessage } = useTranscribe();

//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<BlobPart[]>([]);
//   const [mode, setMode] = useState<"text" | "voice">("text");

//   const sendMessage = () => {
//     if (input.current && input.current.value.trim() !== "") {
//       chat(input.current.value);
//       input.current.value = "";
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
//         await transcribe(audioFile);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Microphone access denied or unavailable.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
//     setChatCameraState(state);
//     setTranscribeCameraState(state);
//   };

//   const loading = chatLoading || transcribeLoading;
//   const message = chatMessage || transcribeMessage;

//   /** Clean neutral button with dark hover */
//   const Button = ({ icon, label, onClick }: { icon: JSX.Element; label: string; onClick: () => void }) => (
//     <button
//       onClick={onClick}
//       className="group flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-semibold 
//                  backdrop-blur-md border border-white/10 shadow-md bg-white/10 
//                  hover:bg-black/20 transition-all duration-300 w-fit"
//     >
//       <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
//         {icon}
//       </span>
//       <span className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
//                        group-hover:ml-1 transition-all duration-300 whitespace-nowrap">
//         {label}
//       </span>
//     </button>
//   );

//   return (
//     <div
//       className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between ${
//         hidden ? "hidden" : ""
//       }`}
//     >
//       {/* LEFT SIDE BUTTONS */}
//       <div className="absolute top-6 left-4 flex flex-col gap-4 pointer-events-auto">
//         {/* Camera Buttons */}
//         <div className="p-3 rounded-[2rem] bg-white/5 backdrop-blur-md shadow-lg border border-white/10 flex flex-col gap-3">
//           <Button icon={<ZoomIn size={20} />} label="Zoom In" onClick={() => setCameraState("zoomed")} />
//           <Button icon={<RotateCcw size={20} />} label="Default" onClick={() => setCameraState("default")} />
//           <Button icon={<ZoomOut size={20} />} label="Zoom Out" onClick={() => setCameraState("zoomout")} />
//         </div>

//         {/* Avatar Switcher */}
//         <div className="p-3 rounded-[2rem] bg-white/5 backdrop-blur-md shadow-lg border border-white/10 flex flex-col gap-3">
//           <Button icon={<User size={20} />} label="Female" onClick={() => setSelectedModel("female")} />
//           <Button icon={<Palette size={20} />} label="Stylized" onClick={() => setSelectedModel("stylized")} />
//           <Button icon={<Dog size={20} />} label="Shiba" onClick={() => setSelectedModel("shiba")} />
//           <Button icon={<Camera size={20} />} label="Male" onClick={() => setSelectedModel("wawa")} />
//         </div>
//       </div>

//       {/* TOP CENTER MODE SWITCHER */}
//       <div className="p-6 flex justify-center w-full pointer-events-auto">
//         <div className="flex gap-3 p-3 rounded-full bg-white/5 backdrop-blur-md shadow-lg border border-white/10">
//           <Button icon={<MessageSquareText size={18} />} label="Text" onClick={() => setMode("text")} />
//           <Button icon={<Mic size={18} />} label="Voice" onClick={() => setMode("voice")} />
//         </div>
//       </div>

//       {/* BOTTOM CENTER INPUT */}
//       <div className="mb-[5rem] self-center pointer-events-auto w-full flex justify-center">
//         {mode === "text" ? (
//           <div className="flex min-w-[40rem] max-w-[50rem] rounded-full bg-black/5 border border-white/10 shadow-lg backdrop-blur-md px-4 py-2 gap-2">
//             <input
//               ref={input}
//               className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//             />
//             <Button icon={<Send size={18} />} label="Send" onClick={sendMessage} />
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-4 text-white text-sm">
//             <Button
//               icon={<Mic size={24} />}
//               label={isRecording ? "Stop" : "Record"}
//               onClick={isRecording ? stopRecording : startRecording}
//             />
//             <div className="text-center text-white/80">
//               {isRecording
//                 ? "Recording... Tap to stop."
//                 : loading
//                 ? "Processing..."
//                 : "Tap to record your message."}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


















// import { useRef, useState } from "react";
// import { useChat } from "../hooks/useChat";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   User,
//   Palette,
//   Dog,
//   MessageSquareText,
//   Mic,
//   Send,
//   Moon,
//   Sun,
//   User2
// } from "lucide-react";

// export const UI = ({
//   hidden,
//   setSelectedModel
// }: {
//   hidden?: boolean;
//   setSelectedModel: (m: string) => void;
// }) => {
//   const input = useRef<HTMLInputElement>(null);
//   const { chat, loading: chatLoading, setCameraState: setChatCameraState, message: chatMessage } = useChat();

//   const [mode, setMode] = useState<"text" | "voice">("text");
//   const [darkMode, setDarkMode] = useState(false);

//   // Prevent double-trigger by tracking last send time
//   const sendMessage = (() => {
//     let lastTime = 0;
//     return () => {
//       const now = Date.now();
//       if (now - lastTime < 300) return; // block if called twice within 300ms
//       lastTime = now;

//       if (input.current && input.current.value.trim() !== "") {
//         chat(input.current.value);
//         input.current.value = "";
//       }
//     };
//   })();

//   const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
//     setChatCameraState(state);
//   };

//   const loading = chatLoading;
//   const message = chatMessage;

//   const Button = ({
//     icon,
//     label,
//     onClick
//   }: {
//     icon: JSX.Element;
//     label: string;
//     onClick: () => void;
//   }) => (
//     <button
//       onClick={onClick}
//       className={`group flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold 
//                  backdrop-blur-md border shadow-md transition-all duration-300 w-fit
//                  ${darkMode
//                    ? "text-white border-white/20 bg-white/10 hover:bg-white/20"
//                    : "text-black border-black/10 bg-black/5 hover:bg-black/10"}`}
//     >
//       <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
//         {icon}
//       </span>
//       <span
//         className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
//                        group-hover:ml-1 transition-all duration-300 whitespace-nowrap"
//       >
//         {label}
//       </span>
//     </button>
//   );

//   return (
//     <div
//       className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between transition-all duration-500 ${
//         hidden ? "hidden" : ""
//       } ${darkMode ? "text-white" : "text-black"}`}
//     >
//       {/* Dark Mode Toggle */}
//       <div className="absolute top-4 right-4 pointer-events-auto">
//         <button
//           onClick={() => setDarkMode((prev) => !prev)}
//           className="gradient-border p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-300"
//         >
//           {darkMode ? (
//             <Sun size={20} className="text-yellow-300" />
//           ) : (
//             <Moon size={20} className="text-blue-500" />
//           )}
//         </button>
//       </div>

//       {/* LEFT SIDE BUTTONS */}
//       <div className="absolute top-6 left-4 flex flex-col gap-4 pointer-events-auto">
//         {/* Camera Buttons */}
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-3 flex flex-col gap-3">
//             <Button icon={<ZoomIn size={20} />} label="Zoom In" onClick={() => setCameraState("zoomed")} />
//             <Button icon={<RotateCcw size={20} />} label="Default" onClick={() => setCameraState("default")} />
//             <Button icon={<ZoomOut size={20} />} label="Zoom Out" onClick={() => setCameraState("zoomout")} />
//           </div>
//         </div>

//         {/* Avatar Switcher */}
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-3 flex flex-col gap-3">
//             <Button icon={<User size={20} />} label="Female" onClick={() => setSelectedModel("female")} />
//             <Button icon={<Palette size={20} />} label="Stylized" onClick={() => setSelectedModel("stylized")} />
//             <Button icon={<Dog size={20} />} label="Shiba" onClick={() => setSelectedModel("shiba")} />
//             <Button icon={<User2 size={20} />} label="Male" onClick={() => setSelectedModel("wawa")} />
//           </div>
//         </div>
//       </div>

//       {/* TOP CENTER MODE SWITCHER */}
//       <div className="p-6 flex justify-center w-full pointer-events-auto">
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner flex gap-3 p-3 rounded-full">
//             <Button icon={<MessageSquareText size={18} />} label="Text" onClick={() => setMode("text")} />
//             <Button icon={<Mic size={18} />} label="Voice" onClick={() => setMode("voice")} />
//           </div>
//         </div>
//       </div>

//       {/* BOTTOM CENTER INPUT */}
//       <div className="mb-[5rem] self-center pointer-events-auto w-full flex justify-center">
//         {mode === "text" ? (
//           <div className={`gradient-border min-w-[42rem] max-w-[55rem] ${darkMode ? "dark-gradient" : ""}`}>
//             <div className="inner flex rounded-full px-6 py-3 gap-3">
//               <input
//                 ref={input}
//                 className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-lg ${
//                   darkMode ? "text-white placeholder-white" : "text-black placeholder-black"
//                 }`}
//                 placeholder="Type your message..."
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//               />
//               <Button icon={<Send size={20} />} label="Send" onClick={sendMessage} />
//             </div>
//           </div>
//         ) : (
//           <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//             <div className="inner flex flex-col items-center gap-4 text-sm px-6 py-4">
//               <div className={`text-center opacity-80 ${darkMode ? "text-white" : "text-black"}`}>
//                 Voice mode is currently disabled — Mic button is just for show.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };









import { useRef, useState } from "react";
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
  const [darkMode, setDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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
