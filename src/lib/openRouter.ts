import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const FREE_AI_MODEL = process.env.OPENROUTER_MODEL ?? 'mistralai/mistral-7b-instruct'

export const openrouter = createOpenRouter({
  apiKey: process.env.AI_KEY,
})
