"use client";

import { useState } from "react";
import { Message, useChat } from "ai/react";

export default function Chat() {
  const { messages, append, input, handleSubmit, handleInputChange } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const topics = [
    { emoji: "", value: "Work" },
    { emoji: "", value: "People" },
    { emoji: "", value: "Animals" },
    { emoji: "", value: "Food" },
    { emoji: "", value: "Coding apps" },
  ];
  const tones = [
    { emoji: "", value: "Witty" },
    { emoji: "", value: "Dark" },
    { emoji: "", value: "Silly" },
    { emoji: "", value: "Sarcastic" },
    { emoji: "", value: "Goofy" },
  ];
  const types = [
    { emoji: "", value: "Knock-Knock" },
    { emoji: "", value: "Story" },
  ];
  const temperatures = [
    { emoji: "", value: "low" },
    { emoji: "", value: "medium" },
    { emoji: "", value: "high" },
  ];

  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: "",
    article: ""
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">influencerGPT App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              We create social networks posts for you from articles you shared with us.
            </p>
          </div>

          <div className="space-y-2 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {messages.length == 0 && (
              <form className="mt-8 w-full flex flex-col">


                <input
                  id="101"
                  name="article"
                  className="w-full p-2 border border-gray-300 rounded shadow-xl text-black"
                  disabled={isLoading}
                  placeholder="Give me the article..."
                  onChange={handleChange}
                />

                <button
                  className="space-y-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    console.log("chat article:", state.article);
                    const response = await fetch("api/chat", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        message: { role: "user", content: state.article },
                      }),
                    });
                    const data = await response.json();
                    console.log("chat response:", data);
                    setIsLoading(false);
                    const chats: Message = {
                      "id": "chats",
                      "role": "user",
                      "content": data

                    };
                    messages.push(chats);


                  }}
                >
                  Generate post
                </button>
              </form>
            )}
            {messages.length >= 1 && !isLoading && (
              <button
                className="space-y-4 bg-blue-500 p-2 text-white rounded shadow-xl"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const response = await fetch("api/tweets", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: { role: "user", content: messages[0].content },
                    }),
                  });
                  const data = await response.json();
                  console.log("tweets response:", data);
                  setIsLoading(false);
                  
                  const tweets: Message = {
                    "id": "tweets",
                    "role": "assistant",
                    "content": data

                  };
                  messages.push(tweets);


                }}
              >
                Generate tweets
              </button>
            )}
          </div>

          <div className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
            hidden={
              messages.length === 0
            }>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap ${m.role === "user"
                  ? "bg-green-700 p-3 m-2 rounded-lg"
                  : "bg-slate-700 p-3 m-2 rounded-lg"
                  }`}
              >
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}