
import { useState, useMemo, useEffect, useRef } from "react";
import { App } from "../App";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "../components/ChatMessage";
import { appConfig } from "../../config.browser";
import { Welcome } from "../components/Welcome";

export default function Index() {
  const [message, setMessage] = useState<string>("");

  const { currentChat, chatHistory, sendMessage, cancel, state, clear } = useChat();

  const currentMessage = useMemo(() => {
    return { content: currentChat ?? "", role: "assistant" } as const;
  }, [currentChat]);

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat, chatHistory, state]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
                        sendMessage(phrase, chatHistory).then(() => setMessage(""));
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

          <div ref={bottomRef} />
        </section>

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
