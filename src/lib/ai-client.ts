import { env } from '@/env.mjs';
import { createAnthropic } from '@ai-sdk/anthropic';
import { getEarningsCall } from './fmp/info/get-earnings-call';

const aiClient = createAnthropic({
  apiKey: env.AI_API_KEY,
});

export const summarizeEarningsCall = async ({ symbol }: { symbol: string }) => {
  try {
    const earningsCall = await getEarningsCall({ symbol });

    if (!earningsCall?.content) {
      return null;
    }

    const message = await aiClient.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are a financial analyst. Analyze this earnings call transcript and provide:
1. One sentence summary including company trajectory (bullish/bearish)
2. Key supporting data points (brief bullet points)

Transcript:
${earningsCall.content}`,
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error summarizing earnings call:', error);
    return null;
  }
};
