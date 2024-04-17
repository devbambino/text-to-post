"use client";

import { useState } from "react";
import { Message, useChat } from "ai/react";

export default function Chat() {
  const { messages, append, isLoading, input, handleSubmit, handleInputChange } = useChat();
  const [tweetIsLoading, setTweetIsLoading] = useState(false);
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
          {/*
          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topic</h3>

            <div className="flex flex-wrap justify-center">
              {topics.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="topic"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Types</h3>

            <div className="flex flex-wrap justify-center">
              {types.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="type"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Level of fun</h3>

            <div className="flex flex-wrap justify-center">
              {temperatures.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="temperature"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
          */}

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Level of fun</h3>

            <div className="flex flex-wrap justify-center">
              {temperatures.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="temperature"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <form onSubmit={handleSubmit} className="mt-8 w-full flex flex-col">

              {messages.length == 0 && (
                <input
                  className="w-full p-2 border border-gray-300 rounded shadow-xl text-black"
                  disabled={isLoading}
                  value={input}
                  placeholder="Give me the article..."
                  onChange={handleInputChange}

                />)}
              <button
                className="space-y-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading}
                type="submit"
              >
                Generate post
              </button>
            </form>
            {messages.length == 2 && !isLoading && !tweetIsLoading && (
              <button
                className="space-y-4 bg-blue-500 p-2 text-white rounded shadow-xl"
                disabled={tweetIsLoading}
                onClick={async () => {
                  setTweetIsLoading(true);
                  const response = await fetch("api/tweets", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: { role: "user", content: messages[messages.length - 1].content },
                    }),
                  });
                  const data = await response.json();
                  console.log("tweets response:", data);
                  setTweetIsLoading(false);
                  const tweets: Message = {
                    "id":"tweets",
                    "role":"assistant",
                    "content":data.message.content

                  };
                  messages.push(tweets);
                  
                  
                }}
              >
                Generate tweets
              </button>
            )}
          </div>



          <div

            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>
          <div className="bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap ${m.role === "user"
                  ? "bg-green-700 p-3 m-2 rounded-lg"
                  : "bg-slate-700 p-3 m-2 rounded-lg"
                  }`}
              >
                {m.role === "user" ? "User: " : "AI: "}
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}