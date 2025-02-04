
import { useState, useMemo, useEffect, useRef } from "react";
import { App } from "../App";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "../components/ChatMessage";
import { appConfig } from "../../config.browser";
import { Welcome } from "../components/Welcome";
import { EndMessage } from "../components/EndMessage";
import { EndMessageMoreInfo } from "../components/EndMessageMoreInfo";

export default function Index() {
  const [message, setMessage] = useState<string>("");
  const [showBMWButton, setShowBMWButton] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [showEndMessageMoreInfo, setShowEndMessageMoreInfo] = useState(false);
  const { currentChat, chatHistory, sendMessage, cancel, state, clear } = useChat();

  const currentMessage = useMemo(() => {
    return { content: currentChat ?? "", role: "assistant" } as const;
  }, [currentChat]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat, chatHistory, state]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const assistantMessageCount = chatHistory.filter((msg) => msg.role === "assistant").length;
    setShowBMWButton(assistantMessageCount >= 5);
  }, [chatHistory]);

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [state]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(message, chatHistory);
    setMessage("");
  };

  return (
    <App title="BMW AI chat bot">
      <main className="bg-white md:rounded-lg md:shadow-md p-6 w-full h-full flex flex-col">
        <section className="overflow-y-auto flex-grow mb-4 pb-8">
          <div className="flex flex-col space-y-4">
            {chatHistory.length === 0 ? (
              <>
                <Welcome />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appConfig.samplePhrases.map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => {
                        sendMessage(phrase, chatHistory);
                        setMessage("");
                      }}
                      className="bg-gray-100 border-gray-300 border-2 rounded-lg p-4"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <p className="text-sm text-gray-500 mt-5">
                    Built with {" "}
                    <a
                      className="underline"
                      href="https://github.com/ascorbic/daneel"
                    >
                      Daneel
                    </a>
                  </p>
                </div>
              </>
            ) : (
              chatHistory.map((chat, i) => (
                <ChatMessage key={i} message={chat} />
              ))
            )}

            {currentChat ? <ChatMessage message={currentMessage} /> : null}
          </div>
          {showEndMessage && <EndMessage />}
          {showEndMessageMoreInfo && <EndMessageMoreInfo />} 
          <div ref={bottomRef} />
        </section>
        
        {showBMWButton && (
          <div className="mb-4 flex flex-col items-center space-y-2">
            <p className="text-center font-semibold">Would you like more information about your BMW after completing the survey?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => {
                  setShowEndMessageMoreInfo(true);
                  setShowEndMessage(false);
                  //log button click
                  const userId = localStorage.getItem("chatUserId");
                  if (!userId) {
                    console.error("User ID not found");
                    return;
                  }
                  fetch("/.netlify/functions/logButton", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                      userId, 
                      buttonClicked: "Yes" 
                    }),
                  }).catch((error) => console.error("Error logging button click:", error));
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => {
                  setShowEndMessage(true);
                  setShowEndMessageMoreInfo(false);
                   //log button click
                   const userId = localStorage.getItem("chatUserId");
                   if (!userId) {
                     console.error("User ID not found");
                     return;
                   }
                   fetch("/.netlify/functions/logButton", {
                     method: "POST",
                     headers: {
                       "Content-Type": "application/json",
                     },
                     body: JSON.stringify({ 
                       userId, 
                       buttonClicked: "No" 
                     }),
                   }).catch((error) => console.error("Error logging button click:", error));
                }}
              >
                No
              </button>
            </div>
          </div>
        )}

        <section className="bg-gray-100 rounded-lg p-2">
          <form className="flex" onSubmit={handleSendMessage}>
            {chatHistory.length > 1 ? (
              <button
                className="bg-gray-100 text-gray-600 py-2 px-4 rounded-l-lg"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clear();
                  setMessage("");
                }}
              >
                Clear
              </button>
            ) : null}
            <input
              type="text"
              ref={inputRef}
              className="w-full rounded-l-lg p-2 outline-none"
              placeholder={state === "idle" ? "Type your message..." : "..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={state !== "idle"}
            />
            {state === "idle" ? (
              <button 
              className={`py-2 px-4 rounded-r-lg font-bold ${
                state === "idle" 
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-gray-400 text-gray-600"
              }`}
              disabled={state !== "idle"}
              type="submit"
            >
              Send
            </button>
            ) : null}
          </form>
        </section>
      </main>
    </App>
  );
}
