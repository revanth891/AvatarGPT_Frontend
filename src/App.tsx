// //Local Upload Script

// import { Loader } from "@react-three/drei";
// import { Leva } from "leva";
// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience";
// import { UI } from "./components/UI";
// import { ChatProvider } from "./hooks/useChat";
// import { TranscribeProvider } from "./hooks/useTranscribe";
// import Spline from "@splinetool/react-spline";
// import { Lipsync } from "wawa-lipsync";
// import { ChatOverlay } from "./components/ChatOverlay";

// export const lipsyncManager = new Lipsync();

// function App() {
//   return (
//     <>
//       <Loader />
//       <Leva hidden/>
//       <ChatProvider>
//         <TranscribeProvider>
//           <UI />
          

//           {/* ✅ 1. Fullscreen Spline background (interactive) */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 0,
//               pointerEvents: "auto",
//             }}
//           >
//             <Spline scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode" />
//             {/* <Spline scene="https://prod.spline.design/ypaKhxVB3saKuuvh/scene.splinecode" /> */}
            
//           </div>

//           {/* <div
//             style={{
//               position: "fixed",
//               top: -200,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 0,
//               pointerEvents: "none",
//             }}
//           >
//             <ChatOverlay />
//           </div> */}

//           {/* ✅ 2. Fullscreen Canvas above Spline (only right side interactive) */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 1,
//               pointerEvents: "none", // Block global canvas pointer events
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 left: "70vw",
//                 top: 0,
//                 width: "30vw",
//                 height: "100vh",
//                 pointerEvents: "auto", // Only allow interaction on the right half
//               }}
//             >
//               <Canvas
//                 shadows
//                 camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
//                 style={{ background: "transparent" }}
                
//               >
//                 <Experience />
//               </Canvas>
//               <ChatOverlay />
//             </div>
//           </div>
//         </TranscribeProvider>
//       </ChatProvider>
//     </>
//   );
// }

// export default App;



// Local Upload Script

import { useState } from "react";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { ChatProvider } from "./hooks/useChat";
import { TranscribeProvider } from "./hooks/useTranscribe";
import Spline from "@splinetool/react-spline";
import { Lipsync } from "wawa-lipsync";
import { ChatOverlay } from "./components/ChatOverlay";

export const lipsyncManager = new Lipsync();

function App() {
  const [selectedModel, setSelectedModel] = useState<"female" | "stylized" | "shiba" | "wawa">("female");

  return (
    <>
      <Loader />
      <Leva hidden />
      <ChatProvider>
        <TranscribeProvider>
          {/* UI with model switcher */}
          <UI setSelectedModel={setSelectedModel} />

          {/* ✅ 1. Fullscreen Spline background (interactive) */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
              pointerEvents: "auto",
            }}
          >
            <Spline scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode" />
            {/* <Spline scene="https://prod.spline.design/ypaKhxVB3saKuuvh/scene.splinecode" /> */}
          </div>

          {/* ✅ 2. Fullscreen Canvas above Spline (only right side interactive) */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1,
              pointerEvents: "none", // Block global canvas pointer events
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "70vw",
                top: 0,
                width: "30vw",
                height: "100vh",
                pointerEvents: "auto", // Only allow interaction on the right half
              }}
            >
              <Canvas
                shadows
                camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
                style={{ background: "transparent" }}
              >
                <Experience selectedModel={selectedModel} />
              </Canvas>
              <ChatOverlay />
            </div>
          </div>
        </TranscribeProvider>
      </ChatProvider>
    </>
  );
}

export default App;










// //Avaturn_Integrated Script
// import { Loader } from "@react-three/drei";
// import { Leva } from "leva";
// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience_Avaturn";
// import { UI } from "./components/UI";
// import { ChatProvider } from "./hooks/useChat";
// import { TranscribeProvider } from "./hooks/useTranscribe";
// import Spline from "@splinetool/react-spline";
// import { Lipsync } from "wawa-lipsync";
// import { ChatOverlay } from "./components/ChatOverlay";
// import { useEffect, useState } from "react";

// // @ts-ignore
// import { AvaturnSDK } from "@avaturn/sdk";

// export const lipsyncManager = new Lipsync();

// function App() {
//   const [modelUrl, setModelUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const savedModel = localStorage.getItem("avaturnModel");
//     if (savedModel) {
//       setModelUrl(savedModel);
//     } else {
//       initAvaturn();
//     }
//   }, []);

//   const initAvaturn = async () => {
//     const existing = document.getElementById("avaturn-sdk-container");
//     if (existing) existing.remove();

//     const container = document.createElement("div");
//     container.id = "avaturn-sdk-container";
//     container.style.position = "fixed";
//     container.style.top = "0";
//     container.style.left = "0";
//     container.style.width = "100vw";
//     container.style.height = "100vh";
//     container.style.zIndex = "9999";
//     container.style.background = "#ffffff";
//     document.body.appendChild(container);

//     const sdk = new AvaturnSDK();
//     const subdomain = "demo"; // your Avaturn subdomain
//     const url = `https://${subdomain}.avaturn.dev`;

//     await sdk.init(container, { url });
//     sdk.on("export", (data: { url: string }) => {
//       console.log("New avatar URL:", data.url);
//       setModelUrl(data.url);
//       localStorage.setItem("avaturnModel", data.url);
//       container.remove();
//     });
//   };

//   return (
//     <>
//       <Loader />
//       <Leva hidden />
//       <ChatProvider>
//         <TranscribeProvider>
//           <UI />

//           {/* ✅ Add "Change Avatar" button */}
//           <button
//             onClick={initAvaturn}
//             style={{
//               position: "fixed",
//               top: 20,
//               right: 20,
//               zIndex: 999,
//               padding: "10px 20px",
//               background: "#111",
//               color: "#fff",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: "14px",
//             }}
//           >
//             Change Avatar
//           </button>

//           {/* ✅ Spline background */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 0,
//               pointerEvents: "auto",
//             }}
//           >
//             <Spline scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode" />
//           </div>

//           {/* ✅ Canvas section */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 left: "70vw",
//                 top: 0,
//                 width: "30vw",
//                 height: "100vh",
//                 pointerEvents: "auto",
//               }}
//             >
//               {modelUrl && (
//                 <Canvas
//                   shadows
//                   camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
//                   style={{ background: "transparent" }}
//                 >
//                   <Experience modelUrl={modelUrl} />
//                 </Canvas>
//               )}
//               <ChatOverlay />
//             </div>
//           </div>
//         </TranscribeProvider>
//       </ChatProvider>
//     </>
//   );
// }

// export default App;
