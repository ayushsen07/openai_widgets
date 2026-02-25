import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    // Validate content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7 } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validate each message
    const isValidMessages = messages.every((msg: any) => 
      msg && typeof msg === 'object' && 
      ['user', 'assistant', 'system'].includes(msg.role) &&
      typeof msg.content === 'string'
    );

    if (!isValidMessages) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    return NextResponse.json({
      message: completion.choices[0].message,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Handle OpenAI API errors specifically
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: 'OpenAI API Error',
          message: error.message,
          code: error.code,
          status: error.status
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error processing your request',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
