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
        `You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a summarized version of a large text that is suitable for a social network post. You have to split the summary in several texts suitable for twitter posts (no more than 280 characters) including up to 5 relevant hashtags. The writing style should be charming, engaging but professional. Return the response as a JSON object that has an array called tweets that contains the twitter posts generated inside a tweet string field.  DON'T ADD ANY EXTRA TEXT BESIDES THE JSON OBJECT.`,
          //`You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a large text that you must summarize and re-write to make it suitable for a social network post. The summarized text should be less than 100 words, and should include in the end a list with the top 7 most relevant words from the text. The writing style should be charming, engaging but professional`,
      },
      {role: "user",
      content:message.content},
    ],
  });
  console.log("api tweets:",response.choices[0].message.content);

  return new Response(JSON.stringify(response.choices[0].message.content))

  //const stream = OpenAIStream(response);
  //return new StreamingTextResponse(stream);
}