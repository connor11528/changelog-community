import OpenAI from 'openai';

// Export the configured client
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});