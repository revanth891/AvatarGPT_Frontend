// // src/components/ChatOverlay.tsx
// import { useChat } from "../hooks/useChat";

// export const ChatOverlay = () => {
//   const { messages } = useChat();

//   return (
//     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[600px] max-w-[90%] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shadow-lg pointer-events-auto">
//       <h2 className="text-lg font-semibold mb-2 text-center">Your AI Response</h2>
//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {messages?.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               className="bg-white/10 p-3 rounded-md text-sm border border-white/10"
//             >
//               {msg.text}
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-gray-300 text-center">Ask something to begin!</p>
//         )}
//       </div>
//     </div>
//   );
// };


// import { useChat } from "../hooks/useChat";

// export const ChatOverlay = () => {
//   const { messages } = useChat();

//   return (
//     <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[1000px] max-w-[90%] backdrop-blur-md rounded-2xl border border-white/20 bg-[#ff00ff0a] p-5 shadow-xl pointer-events-auto">
//       <h2 className="text-xl font-bold text-center text-white mb-3"> Your AI Response</h2>

//       <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
//         {messages?.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-black shadow-sm"
//             >
//               {msg.text}
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-l font-bold text-black-300">Ask something to begin!</p>
//         )}
//       </div>
//     </div>
//   );
// };



// import { useChat } from "../hooks/useChat";

// export const ChatOverlay = () => {
//   const { messages } = useChat();

//   return (
//     <div
//       className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[1000px] max-w-[100%] 
//       backdrop-blur-md rounded-2xl border border-white/20 bg-white/10 
//       shadow-xl pointer-events-auto p-5"
//       style={{
//         backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
//         backgroundSize: "4px 4px",
//       }}
//     >
//       <h2 className="text-lg font-semibold text-center text-white mb-4">
//         Your AI Response
//       </h2>

//       <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
//         {messages?.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white shadow-sm"
//             >
//               {msg.text}
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-white/60 text-sm">
//             Ask something to begin!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };



import { useChat } from "../hooks/useChat";

export const ChatOverlay = ({ darkMode }: { darkMode: boolean }) => {
  const { messages } = useChat();

  return (
    <div
      className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[1000px] max-w-[100%] pointer-events-auto"
    >
      <div className="gradient-border rounded-2xl">
        <div
          className={`inner rounded-2xl p-5 shadow-xl transition-all duration-500 ${
            darkMode
              ? "bg-white/10 text-white"
              : "bg-black/5 text-black"
          }`}
          style={{
            backgroundImage: darkMode
              ? `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`
              : `radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "4px 4px",
          }}
        >
          <h2
            className={`text-lg font-semibold text-center mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Your AI Response
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {messages?.length > 0 ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-3 text-sm shadow-sm border ${
                    darkMode
                      ? "bg-white/10 border-white/10 text-white"
                      : "bg-black/5 border-black/10 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-white/60" : "text-black/60"
                }`}
              >
                Ask something to begin!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
