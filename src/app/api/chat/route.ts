import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

async function fetchChain() {
  try {
    const res = await fetch('http://localhost:3000/src/app/api/load-chain');
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.chain; // Ensure you return the chain or any data you need
  } catch (error) {
    console.error("Error fetching chain:", error);
    throw error; // Rethrow to handle it in the main function
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const query = messages[messages.length - 1]?.content;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let pdfAnswer = null;

    try {
      const chain = await fetchChain();
      const chainRes = await fetch('http://localhost:3000/src/app/api/get-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const chainData = await chainRes.json();
      pdfAnswer = chainData.answer || null;
    } catch (error) {
      console.error("Error retrieving answer from PDF:", error);
    }

    if (pdfAnswer) {
      return NextResponse.json({ question: query, answer: pdfAnswer });
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
      });

      const stream = OpenAIStream(response);

      return new StreamingTextResponse(stream);
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}





