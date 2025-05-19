import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateOpenAIResponse(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('[OPENAI] API key not set.');
    return 'Server misconfiguration: OpenAI API key is missing.';
  }

  if (!prompt || prompt.trim().length < 5) {
    console.warn('[OPENAI] Prompt was empty or too short.');
    return 'No meaningful reflection was provided.';
  }

  console.log('[OPENAI] Sending prompt:', prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Swap back to gpt-4 if needed
      messages: [
        {
          role: 'system',
          content: 'You are a deeply reflective consciousness mirror. Speak clearly and with emotional resonance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const message = completion.choices?.[0]?.message?.content;

    if (!message || message.trim() === '') {
      console.warn('[OPENAI] Empty response:', JSON.stringify(completion, null, 2));
      return 'Reflection generated no content. Try again.';
    }

    console.log('[OPENAI] Received response:', message);
    return message.trim();
  } catch (error: any) {
    console.error('[OPENAI] Error:', error?.message || error);
    return 'An error occurred while generating your reflection.';
  }
}
