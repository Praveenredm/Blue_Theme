// import { useState } from "react";
// import { MessageSquare, X } from "lucide-react";
// import { ChatPanel } from "./ChatPanel";

// export function ChatWidget() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full 
//         bg-primary text-primary-foreground shadow-lg 
//         flex items-center justify-center transition ${
//           open ? "scale-0" : "scale-100"
//         }`}
//       >
//         <MessageSquare className="h-6 w-6" />
//       </button>

//       {/* Chat Panel */}
//       {open && (
//         <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-card border rounded-xl shadow-xl flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <div>
//               <p className="font-semibold">Refero.ai Health Assistant</p>
//               <p className="text-xs text-muted-foreground">Online</p>
//             </div>
//             <button onClick={() => setOpen(false)}>
//               <X className="h-5 w-5 text-muted-foreground" />
//             </button>
//           </div>

//           <ChatPanel />
//         </div>
//       )}
//     </>
//   );
// }
