import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    //stream: true,
    messages: [
      {
        role: "system",
        content:
        //`You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a large text that you must summarize and re-write to make it suitable for a social network post. The summarized text should be less than 100 words, and should include in the end a list with the top 7 most relevant words from the text as social networks hashtags. The writing style should be charming, engaging but professional. You should also use the summary to create three Twitter posts(less than 280 characters) from it. Return the response as a JSON object that contains the summary fields as the summary generated, and an array called twitter that contains the twitter posts generated.`,
          `You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a large text that you must summarize and re-write to make it suitable for a social network post. The summarized text should be less than 150 words, and you have to also include up to 7 relevant hashtags in the end of the summary. The writing style should be charming, engaging but professional. DON'T ADD ANY EXTRA TEXT BESIDES THE SUMMARY AND THE HASHTAGS.`,
      },
      {role: "user",
      content: message.content},
    ],
  });

  console.log("api chat:", response.choices[0].message.content);

  return new Response(JSON.stringify(response.choices[0].message.content))

  //const stream = OpenAIStream(response);
  //return new StreamingTextResponse(stream);
}