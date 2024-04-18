"use client";

import { useState } from "react";
import { Message, useChat } from "ai/react";

export default function Chat() {
  const { messages, append, input, handleSubmit, handleInputChange } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  let tweetsArray: Message[] = [];

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
  const handleInput = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex flex-col justify-center items-center ">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div>Loading...</div>

          </div>

        </div>

      </div>
    );
  }

  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
  }

  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <h2 className="w-full text-center text-3xl font-bold">influencerGPT App</h2>
            <p className="w-full text-center text-zinc-500 dark:text-zinc-400">
              We create social networks posts for you from articles you shared with us.
            </p>
          </div>

          <div className="space-y-2flex flex-col gap-2">
            {messages.length == 0 && (
              <div className="w-full space-y-2">
                <p className="text-sm leading-6 b-0">
                  Enter a large block of text here and we'll generate for you a summarized version ready to be posted on social networks:
                </p>
                <textarea className="w-full min-h-[200px] border rounded shadow-xl text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the text here..." onChange={handleInput} />

              </div>
            )}
            <form className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"

                hidden={messages.length > 0}
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
              >Generate summary</button>

              {messages.length == 1 && tweetsArray.length == 0 && !isLoading && (
                <button
                  className="w-full md:w-auto order-1 md:order-2 m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled={isLoading}
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

                    const cleanedJsonString = data.replace(/^```json\s*|```\s*$/g, '');
                    const tweetsJson = JSON.parse(cleanedJsonString);
                    // Loop through each tweet and parse relevant information
                    tweetsJson.forEach((tweet: { tweet: string; }, index: number) => {
                      console.log(`Tweet ${index + 1}:`);
                      console.log(`Content: ${tweet.tweet}`);
                      const hashtags = tweet.tweet.match(/#[^\s#]+/g); // Extract hashtags
                      if (hashtags) {
                        console.log(`Hashtags: ${hashtags.join(', ')}`);
                      }
                      console.log('---------------------------------------');
                      const tweets: Message = {
                        "id": "tweets",
                        "role": "assistant",
                        "content": tweet.tweet

                      };
                      //tweetsArray.push(tweets);
                      messages.push(tweets);
                    });

                    setIsLoading(false);

                    /*const tweets: Message = {
                      "id": "tweets",
                      "role": "assistant",
                      "content": data

                    };
                    messages.push(tweets);*/

                  }}>
                  Generate tweets
                </button>
              )}
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                hidden={messages.length < 2}
                disabled={isLoading}
                onClick={async () => {
                  window.location.reload();
                }}
              >Reset</button>
            </form>
          </div>
        </div>

        {messages.length > 0 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">Here's the social network post:</h2>
            </div>
            <textarea
              className="min-h-[100px] border text-black p-3 m-2 rounded"
              id="summary"
              placeholder="The post will appear here."
              value={messages[0].content}
              readOnly
            />
            <a
              className="text-center m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              href="https://www.linkedin.com/sharing/share-offsite/" target="_blank"
              onClick={() => copyText(messages[0].content)}>
              Copy to clipboard & Open Linkedin
            </a>
          </div>
        )}
        {messages.length > 1 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">Here are the tweets:</h2>
            </div>
            {messages.slice(1).map((tweet) => (
              <div className="flex flex-col items-center">
                <div
                  className="w-full bg-white p-3 m-2 rounded border text-black"
                >{tweet.content}
                </div>
                <a className="text-center m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" 
                href="https://twitter.com/intent/tweet?text=" target="_blank"
                onClick={() => copyText(tweet.content)}>
                  Copy to clipboard & Open Twitter
                </a>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );


}