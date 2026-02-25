import { NextResponse } from "next/server";
import { BILLYS_STEAKHOUSE_PROMPT } from '../../../public/prompt';
import { HINDI_PROMPT } from '../../../public/prompt-hindi';
import { AFRIKAANS_PROMPT } from '../../../public/prompt-afrikaans';
import { ZULU_PROMPT } from '../../../public/prompt-zulu'

export async function GET() {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // use server-side key only
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: "gpt-realtime-mini",
          instructions:BILLYS_STEAKHOUSE_PROMPT ,
        },
      }),
    });


    if (!r.ok) {
      const err = await r.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ error: err }, { status: r.status });
    }

    const data = await r.json();
    console.log("Realtime API response:", data);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Session route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
