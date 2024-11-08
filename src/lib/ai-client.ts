import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { getEarningsCall } from './fmp/info/get-earnings-call';
import { logger } from './logger';

export const summarizeEarningsCall = async ({ symbol }: { symbol: string }) => {
  try {
    const earningsCall = await getEarningsCall({ symbol });

    if (!earningsCall?.content) {
      return;
    }

    const { text } = await generateText({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: `
        You are a financial analyst. Analyze this earnings call transcript and provide:
        1. One sentence summary including company trajectory (bullish/bearish)
        2. Key supporting data points (brief bullet points)

        Transcript:
        ${earningsCall.content}`,
    });

    return text;
  } catch (error) {
    logger.error('Error summarizing earnings call:', error);
  }
};
